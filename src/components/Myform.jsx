import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Myform = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    rank: '',
    number: 'Ex: #0123456',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [pdfPreview, setPdfPreview] = useState(null);

  const handle = (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));

      if (files[0]) {
        const filePreview = URL.createObjectURL(files[0]);
        setPhotoPreview(filePreview);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const getBase64Image = (img, callback) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      callback(event.target.result);
    };
    reader.readAsDataURL(img);
  };

  const generatePDF = (callback) => {
    const doc = new jsPDF();

    doc.text(`ID Number: ${formData.number}`, 140, 10);

    if (formData.photo) {
      getBase64Image(formData.photo, (base64Img) => {
        doc.addImage(base64Img, 'JPEG', 10, 20, 50, 50);
        doc.text(`Name: ${formData.name}`, 140, 40);
        doc.text(`Congratulations! You have secured the ${formData.rank}.`, 10, 90);
        const pdfData = doc.output('datauristring');
        callback(pdfData);
      });
    } else {
      doc.text(`Name: ${formData.name}`, 70, 40);
      doc.text(`Congratulations! You have secured the ${formData.rank}.`, 10, 90);
      const pdfData = doc.output('datauristring');
      callback(pdfData);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (formData.photo) {
      console.log('File Name:', formData.photo.name);
    }

    console.table({
      name: formData.name,
      photo: formData.photo ? formData.photo.name : 'No file',
      rank: formData.rank,
      number: formData.number,
    });

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview('');
    }

    generatePDF((pdfData) => {
      setPdfPreview(pdfData);
    });
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfPreview;
    link.download = 'form-data.pdf';
    link.click();
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <form onSubmit={onSubmitHandler} className="p-1 p-md-5 border rounded-5 bg-light">
            <h2 className="text-center mb-4">Sample Form</h2>
            <div className="mb-2">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={handle}
                name="name"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="photo" className="form-label">Photo</label>
              <input
                type="file"
                className="form-control"
                name="photo"
                onChange={handle}
              />
              {photoPreview && (
                <div className="mt-2">
                  <h5>Image Preview:</h5>
                  <img src={photoPreview} alt="Preview" style={{ maxWidth: '100px' }} />
                </div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="rank" className="form-label">Rank</label>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handle}
                name="rank"
              >
                <option value="">Select Rank</option>
                <option value="First Rank">First Rank</option>
                <option value="Second Rank">Second Rank</option>
                <option value="Third Rank">Third Rank</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="number" className="form-label">ID Number</label>
              <input
                type="text"
                className="form-control"
                name="number"
                onChange={handle}
                placeholder="Enter Id Number"
                value={formData.number}
              />
            </div>
            <button type="submit" className="btn btn-primary rounded-5 w-25">Submit</button>
          </form>
        </div>
        <div className="col-lg-6 col-md-4 col-sm-6">
          {pdfPreview && (
            <div className="mt-4">
              <h5>PDF Preview:</h5>
              <iframe src={pdfPreview} width="300px" height="400px"/>
              <br/>
              <button className="btn btn-secondary mt-3" onClick={downloadPDF}>Download PDF</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myform;
