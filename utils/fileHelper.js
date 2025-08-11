const cloudinary = require('cloudinary').v2;

// [MODIFIKASI] parameternya lebih jelas: folder dan oldPublicId (opsional)
const upload = async (fileBuffer, folder = 'images', oldPublicId = null) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // [TAMBAHAN] Logika untuk menentukan tipe aset secara otomatis
  // Jika folder adalah 'documents' atau 'raw',gunakan tipe 'raw'.
  // Jika tidak, biarkan Cloudinary mendeteksi otomatis (untuk gambar/video).
  const resourceType =
    folder === 'documents' || folder === 'raw' ? 'raw' : 'auto';

  const options = {
    // [MODIFIKASI] Gunakan resourceType yang sudah ditentukan
    resource_type: resourceType,
    // [MODIFIKASI] Gunakan folder yang dinamis sesuai parameter
    public_id: `teatersatu/${folder}/${Date.now()}`,
  };

  // Esensi kode lama tetap sama: Hapus file lama jika oldPublicId diberikan
  if (oldPublicId) {
    // Pastikanmenghapus dari resource_type yang benar jika memungkinkan
    await cloudinary.uploader.destroy(oldPublicId, {
      resource_type: resourceType === 'raw' ? 'raw' : 'image',
    });
  }

  // Esensi kode lama tetap sama: Menggunakan upload_stream
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};

const destroy = async (publicId) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  // [TAMBAHAN] Fungsi destroy yang lebih lengkap untuk menghapus file raw
  // Cloudinary memerlukan resource_type untuk menghapus file non-gambar/video
  return await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

module.exports = {
  upload,
  destroy, // Ekspor juga fungsi destroy
};
