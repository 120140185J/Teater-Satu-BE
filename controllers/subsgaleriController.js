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
    ]
  });

  res.status(200).json({
    status: 'success',
    results: subsgaleri.length,
    data: subsgaleri,
  });
});

exports.createSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { files } = req; // Multiple files

  if (!judul) {
    return next(new AppError('Judul is required', 400));
  }

  if (!files || files.length === 0) {
    return next(new AppError('At least one image is required', 400));
  }

  const transaction = await sequelize.transaction();

  try {
    // Upload all images and get URLs
    const urls = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await fileHelper.upload(file.buffer);
        if (!uploadedFile) {
          throw new AppError('Error uploading file', 400);
        }
        return uploadedFile.secure_url;
      })
    );

    // Thumbnail is the first image
    const thumbnail = urls.shift();

    // Create Subsgaleri record
    const subsgaleri = await Subsgaleri.create(
      {
        judul,
        karya,
        deskripsi,
        thumbnail,
      },
      { transaction }
    );

    // Insert remaining images into TempSubsgaleri
    const tempSubsgaleriData = urls.map((url) => ({
      id_subs_galeri: subsgaleri.id,
      image: url,
    }));

    await TempSubsgaleri.bulkCreate(tempSubsgaleriData, { transaction });

    // Commit transaction
    await transaction.commit();

    res.status(201).json({
      status: 'success',
      data: subsgaleri,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    return next(new AppError('Failed to create subsgaleri', 500));
  }
});

exports.updateSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { files } = req; // Multiple files
  const subsgaleriId = req.params.id;

  // Cari data subsgaleri berdasarkan ID
  const subsgaleri = await Subsgaleri.findByPk(subsgaleriId);

  if (!subsgaleri) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Gunakan transaksi untuk memastikan konsistensi data
  const transaction = await sequelize.transaction();

  try {
    // Perbarui data utama subsgaleri
    if (judul) subsgaleri.judul = judul;
    if (karya) subsgaleri.karya = karya;
    if (deskripsi) subsgaleri.deskripsi = deskripsi;

    // Perbarui thumbnail jika ada file baru
    if (files && files.length > 0) {
      // Ambil file pertama untuk thumbnail
      const firstFile = files[0];
      const uploadedThumbnail = await fileHelper.upload(firstFile.buffer);

      if (!uploadedThumbnail) {
        throw new AppError('Error uploading thumbnail', 400);
      }

      // Hapus thumbnail lama jika diperlukan
      if (subsgaleri.thumbnail) {
        await fileHelper.delete(subsgaleri.thumbnail);
      }

      subsgaleri.thumbnail = uploadedThumbnail.secure_url;

      // Sisa file untuk TempSubsgaleri
      const remainingFiles = files.slice(1);

      // Upload sisa file ke TempSubsgaleri
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

        // Tambahkan data baru ke TempSubsgaleri
        await TempSubsgaleri.bulkCreate(tempSubsgaleriData, { transaction });
      }
    }

    // Simpan perubahan subsgaleri
    await subsgaleri.save({ transaction });

    // Commit transaksi
    await transaction.commit();

    res.status(200).json({
      status: 'success',
      data: subsgaleri,
    });
  } catch (error) {
    // Rollback transaksi jika ada kesalahan
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
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subsgaleri,
  });
});

exports.deleteSubsgaleri = handlerFactory.deleteOne(Subsgaleri);
