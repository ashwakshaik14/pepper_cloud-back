const express = require("express");
const Form=require('../schema/Forms.schema');
const router = express.Router();
const mongoose = require("mongoose");


// Get all forms
router.get("/", async (req, res) => {
  const forms = await Form.find();
  res.json(forms);
});

router.post("/", async (req, res) => {
  try {
    console.log("Received Request Body:", JSON.stringify(req.body, null, 2));

    if (!Array.isArray(req.body.inputs)) {
      return res.status(400).json({ error: "Inputs must be an array" });
    }

    const newForm = new Form({
      title: req.body.title,
      inputs: req.body.inputs,
    });

    await newForm.save();
    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
});


// Get a form by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Update a form
// router.put("/update/:id", async (req, res) => {
//   try {
//       const { id } = req.params;
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//           return res.status(400).json({ error: "Invalid ID format" });
//       }

//       const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true });

//       if (!updatedForm) {
//           return res.status(404).json({ error: "Form not found" });
//       }

//       res.json(updatedForm);
//   } catch (error) {
//       console.error("Error updating form:", error);
//       res.status(500).json({ error: "Server error" });
//   }
// });

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
