const Product = require("../models/product");

const prodcuts_getEach = async (req, res) => {
  try {
    await Product.findById(req.params.id).then((data) => {
      res.send(data);
    });
  } catch (e) {
    res.status(404).send("ID no valid");
  }
};

const prodcuts_getall = async (req, res) => {
  try {
    const limit = typeof req.query.limit !== "undefined" ? Number(req.query.limit) : null;

    const offset = typeof req.query.offset !== "undefined" ? Number(req.query.offset) : null;

    const productsCollection = await Product.find({
      user: req.user._id.toString(),
    });

    const productsCollectionCount = await Product.count();

    const totalPages = Math.ceil(productsCollectionCount / limit);

    const currentPage = Math.ceil(productsCollectionCount % offset);
    return res.status(200).send({
      message: "ok",
      data: productsCollection,
      paging: {
        total: productsCollectionCount,
        page: currentPage,
        pages: totalPages,
      },
    });
  } catch (e) {
    console.log("Error", e);
    return res.status(500).send({
      data: null,
    });
  }
};

const getSearchResult = async (req, res) => {
  try {
    return res.status(200).send({
      message: "OK",
    });
  } catch (e) {
    return res.status(404).send({
      message: e.message,
    });
  }
};

const inputPostValue = async (req, res) => {
  try {
    let { searchString } = req.body;
    let response = await Product.find({
      $or: [
        {
          user: req.user._id.toString(),
          name: { $regex: `${searchString}`, $options: "i" },
        },
        {
          user: req.user._id.toString(),
          searchId: { $regex: `${searchString}`, $options: "i" },
        },
      ],
    });

    return res.status(200).send({
      response,
    });
  } catch (e) {
    return res.status(404).send({
      message: e.message,
    });
  }
};

const product_create_post = async (req, res) => {
  try {
    const { image, name, mpns, manifactuler, user, checkbox, searchId } = req.body;

    if (!(image && name && mpns && manifactuler)) {
      return res.status(400).send("data product is not valid");
    }

    const data = await Product.create({
      image,
      name,
      mpns,
      manifactuler,
      user: req.user._id,
      checkbox,
      searchId: "",
    });

    await Product.findByIdAndUpdate(
      { _id: `${data._id.valueOf()}` },
      {
        searchId: `${data._id.valueOf()}`,
      }
    );

    return res.status(200).send({
      message: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).send({
      message: e.message,
      data: null,
    });
  }
};

const product_delete_all = async (req, res) => {
  try {
    Product.deleteMany(
      {
        // convert string of IDs to array of IDs
        _id: { $in: req.params.ids.split(",") },
      },
      function () {
        return res.status(200).send({
          message: "OK",
        });
      }
    );
  } catch (e) {
    return res.status(404).send({
      message: e.message,
    });
  }
};

const product_edit = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(404).send({
      message: e.message,
    });
  }
};

module.exports = {
  prodcuts_getall,
  product_create_post,
  product_edit,
  prodcuts_getEach,
  product_delete_all,
  inputPostValue,
  getSearchResult,
};
