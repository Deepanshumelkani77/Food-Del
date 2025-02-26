import React,{useState,useEffect} from 'react'
import "../add/Add.css"
import { useNavigate, useParams } from 'react-router-dom';


const Edit = () => {



    const { id } = useParams(); // Get the dynamic ID from the URL
    //fetch data from database
    const [foodItem, setFoodItem] = useState({});
    //for sending data
  const [formData, setFormData] = useState({ name: '',image:'', description: '',category:'', price: '' });
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch the food item's details from the backend
      fetch(`http://localhost:4000/foods/${id}`)
        .then((response) => response.json())
        .then((data) => setFoodItem(data))
        .catch((error) => console.error('Error fetching food item:', error));
    }, [id]);



    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`http://localhost:4000/foods/edit/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert('Food item edit successfully!');
          navigate('/'); // Redirect to the home page
        } else {
          console.error('Failed to edit food item');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  

//upload iamge using form
const [file, setFile] = useState(null);
const [uploadedUrl, setUploadedUrl] = useState('');
  // When a file is selected
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 // Upload file to Cloudinary and send URL to backend
 const handleUpload = async () => {
  if (!file) return;
  const formDataa = new FormDataa();
  formDataa.append('file', file);
  // Replace with your Cloudinary unsigned upload preset
  formDataa.append('upload_preset', 'YOUR_UPLOAD_PRESET');

  try {
    // Upload to Cloudinary
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
      formDataa
    );
    //link come from cloudinary
    const imageUrl = res.data.secure_url;
    setUploadedUrl(imageUrl);

    // Send the URL to your backend to store in MongoDB
    await axios.post('http://localhost:4000/save-photo', { imageUrl });
    alert("Photo uploaded and saved successfully!");
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed");
  }
};




  return (
    <div className='add'>

      <form className='flex-col' onSubmit={handleSubmit}>

      <div className="add-product-name ">
<p>Product name</p>
<input type="text" name='name'    value={formData.name}  onChange={handleChange}  placeholder={foodItem.name} />
</div>


<div className="add-img-upload ">
  <p>Upload Image</p>
<input  type="file" onChange={handleFileChange} accept="image/*"  id='image' name='image' placeholder={foodItem.image} value={formData.image}    required/>
</div>


<div className="add-product-discription ">
  <p>Product description</p>
  <textarea name="description" row='5' placeholder={foodItem.description} value={formData.description}  onChange={handleChange}  required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category ">
<p>Product category</p>
<select name="category"    onChange={handleChange} placeholder={foodItem.category} >
  <option value="Salad">Salad</option>
  <option value="Rolls">Rolls</option>
  <option value="Deserts">Deserts</option>
  <option value="Sandwich">Sandwich</option>
  <option value="Cake">Cake</option>
  <option value="Pure Veg">Pure Veg</option>
  <option value="pasta">pasta</option>
  <option value="Noodles">Noodles</option>
</select>
  </div>
  <div className="add-price ">
    <p>Product price</p>
    <input type="number" name="price" placeholder={foodItem.price} value={formData.price}  onChange={handleChange} />
  </div>
</div>

<button type='submit' className='add-btn' onClick={()=>{handleSubmit,handleUpload}}>Update</button>

      </form>
      
    </div>
  )
}

export default Edit
