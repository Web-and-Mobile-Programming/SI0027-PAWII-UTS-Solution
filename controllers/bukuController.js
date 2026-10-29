const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.kategoriId) {
    filter.kategoriId = req.query.kategoriId;
  }

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), MAX_LIMIT);
  const sortField = req.query.sort || "createdAt";
  const projection = req.query.fields ? req.query.fields.split(",").join(" ") : "";

  const data = await Buku.find(filter)
    .populate("kategoriId")
    .select(projection)
    .sort({ [sortField]: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Buku.countDocuments(filter);

  res.json({ data, page, limit, total });
};

exports.getById = async (req, res) => {
  const data = await Buku.findById(req.params.id).populate("kategoriId");
  if (!data) throw { status: 404, message: "Buku tidak ditemukan" };
  res.json(data);
};

exports.create = async (req, res) => {
  const buku = await Buku.create(req.body);
  res.status(201).json(buku);
};

exports.update = async (req, res) => {
  const data = await Buku.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) throw { status: 404, message: "Buku tidak ditemukan" };
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Buku.findByIdAndDelete(req.params.id);
  if (!data) throw { status: 404, message: "Buku tidak ditemukan" };
  res.status(204).send();
};
