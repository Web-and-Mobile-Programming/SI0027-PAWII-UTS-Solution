const mongoose = require("mongoose");

// Subdocument EMBEDDED: penerbit selalu diakses bersama buku
const penerbitSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true, trim: true },
    tahun: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
  },
  { _id: false }
);

const bukuSchema = new mongoose.Schema({
  judul: { type: String, required: true, trim: true },
  isbn: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{13}$/, "ISBN harus 13 digit angka"],
  },
  penulis: {
    type: [String],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "Minimal satu penulis",
    },
  },
  penerbit: penerbitSchema,
  // REFERENCING ke koleksi Kategori
  kategoriId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kategori",
    required: true,
  },
  stok: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Buku", bukuSchema);
