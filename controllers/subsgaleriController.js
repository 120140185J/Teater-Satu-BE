const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Subsgaleri = require('../models/subsgaleriModel');
const handlerFactory = require('./handlerFactory');
const TempSubsgaleri = require('../models/tempSubsgaleriModel');
const sequelize = require('../utils/database');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSubsgaleriPhoto = upload.array('thumbnail', 10);

exports.getAllSubsgaleri = catchAsync(async (req, res, next) => {
  const subsgaleri = await Subsgaleri.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: TempSubsgaleri,
        as: 'tempSubsgaleri',
        attributes: ['id', 'image'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: subsgaleri.length,
    data: subsgaleri,
  });
});

exports.createSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { files } = req;

  if (!judul) {
    return next(new AppError('Judul is required', 400));
  }

  if (!files || files.length === 0) {
    return next(new AppError('At least one image is required', 400));
  }

  const transaction = await sequelize.transaction();

  try {
    const urls = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await fileHelper.upload(file.buffer);
        if (!uploadedFile) {
          throw new AppError('Error uploading file', 400);
        }
        return uploadedFile.secure_url;
      })
    );

    const thumbnail = urls.shift();

    const subsgaleri = await Subsgaleri.create(
      {
        judul,
        karya,
        deskripsi,
        thumbnail,
      },
      { transaction }
    );

    const tempSubsgaleriData = urls.map((url) => ({
      id_subs_galeri: subsgaleri.id,
      image: url,
    }));

    await TempSubsgaleri.bulkCreate(tempSubsgaleriData, { transaction });

    await transaction.commit();

    res.status(201).json({
      status: 'success',
      data: subsgaleri,
    });
  } catch (error) {
    await transaction.rollback();
    return next(new AppError('Failed to create subsgaleri', 500));
  }
});

exports.updateSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { files } = req;
  const subsgaleriId = req.params.id;

  const subsgaleri = await Subsgaleri.findByPk(subsgaleriId);

  if (!subsgaleri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  const transaction = await sequelize.transaction();

  try {
    if (judul) subsgaleri.judul = judul;
    if (karya) subsgaleri.karya = karya;
    if (deskripsi) subsgaleri.deskripsi = deskripsi;

    if (files && files.length > 0) {
      const firstFile = files[0];
      const uploadedThumbnail = await fileHelper.upload(firstFile.buffer);

      if (!uploadedThumbnail) {
        throw new AppError('Error uploading thumbnail', 400);
      }

      if (subsgaleri.thumbnail) {
        await fileHelper.delete(subsgaleri.thumbnail);
      }

      subsgaleri.thumbnail = uploadedThumbnail.secure_url;

      const remainingFiles = files.slice(1);

      if (remainingFiles.length > 0) {
        const tempSubsgaleriData = await Promise.all(
          remainingFiles.map(async (file) => {
            const uploadedFile = await fileHelper.upload(file.buffer);
            if (!uploadedFile) {
              throw new AppError('Error uploading file', 400);
            }

            return {
              id_subs_galeri: subsgaleriId,
              image: uploadedFile.secure_url,
            };
          })
        );

        await TempSubsgaleri.bulkCreate(tempSubsgaleriData, { transaction });
      }
    }

    await subsgaleri.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      status: 'success',
      data: subsgaleri,
    });
  } catch (error) {
    await transaction.rollback();
    return next(new AppError('Failed to update subsgaleri', 500));
  }
});

exports.getSubGaleri = catchAsync(async (req, res, next) => {
  const subsgaleri = await Subsgaleri.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: TempSubsgaleri,
        as: 'tempSubsgaleri',
        attributes: ['id', 'image'],
      },
    ],
  });

  if (!subsgaleri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subsgaleri,
  });
});

exports.deleteTempSubsgaleri = catchAsync(async (req, res, next) => {
  const { id_subs_galeri } = req.params;

  const tempSubsgaleri = await TempSubsgaleri.findAll({
    where: { id_subs_galeri },
  });

  if (tempSubsgaleri.length === 0) {
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Coba hapus file dari storage, tapi lanjutkan jika gagal
    await Promise.all(
      tempSubsgaleri.map(async (img) => {
        try {
          await fileHelper.delete(img.image);
          console.log(`Deleted file: ${img.image}`);
        } catch (error) {
          console.error(`Failed to delete file ${img.image}:`, error.message);
          // Lanjutkan meskipun penghapusan file gagal
        }
      })
    );

    // Hapus record dari temp_subs_galeris
    await TempSubsgaleri.destroy({
      where: { id_subs_galeri },
      transaction,
    });

    await transaction.commit();

    console.log(
      `Deleted ${tempSubsgaleri.length} temp subsgaleri records for id_subs_galeri: ${id_subs_galeri}`
    );

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting temp subsgaleri:', {
      message: error.message,
      stack: error.stack,
    });
    return next(new AppError('Failed to delete temp subsgaleri', 500));
  }
});

exports.deleteSubsgaleri = catchAsync(async (req, res, next) => {
  const subsgaleriId = req.params.id;

  const subsgaleri = await Subsgaleri.findByPk(subsgaleriId);

  if (!subsgaleri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  const transaction = await sequelize.transaction();

  try {
    // Coba hapus thumbnail dari storage
    if (subsgaleri.thumbnail) {
      try {
        await fileHelper.delete(subsgaleri.thumbnail);
        console.log(`Deleted thumbnail: ${subsgaleri.thumbnail}`);
      } catch (error) {
        console.error(
          `Failed to delete thumbnail ${subsgaleri.thumbnail}:`,
          error.message
        );
        // Lanjutkan meskipun penghapusan file gagal
      }
    }

    // Hapus semua record terkait di temp_subs_galeris
    const tempSubsgaleri = await TempSubsgaleri.findAll({
      where: { id_subs_galeri: subsgaleriId },
    });

    await Promise.all(
      tempSubsgaleri.map(async (img) => {
        try {
          await fileHelper.delete(img.image);
          console.log(`Deleted file: ${img.image}`);
        } catch (error) {
          console.error(`Failed to delete file ${img.image}:`, error.message);
        }
      })
    );

    await TempSubsgaleri.destroy({
      where: { id_subs_galeri: subsgaleriId },
      transaction,
    });

    // Hapus record di subs_galeris
    await subsgaleri.destroy({ transaction });

    await transaction.commit();

    console.log(`Deleted subsgaleri with id: ${subsgaleriId}`);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting subsgaleri:', {
      message: error.message,
      stack: error.stack,
    });
    return next(new AppError('Failed to delete subsgaleri', 500));
  }
});
