const Kategori = require('../models/kategoriModel');
const handlerFactory = require('./handlerFactory');

exports.getAllKategori = handlerFactory.getAll(Kategori);
exports.getKategori = handlerFactory.getOne(Kategori);
exports.createKategori = handlerFactory.createOne(Kategori);
exports.updateKategori = handlerFactory.updateOne(Kategori);
exports.deleteKategori = handlerFactory.deleteOne(Kategori);
