import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox";
import MessageBox from "../../components/messageBox/MessageBox";
import { Store } from "../../Store";
import { getError } from "../../utils.jsx";
import "./productEditPage.scss";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, error: payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: payload };

    default:
      return state;
  }
};
const ProductEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, { loading: true, error: "" });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${BASE_API_URL}/products/${productId}`
        );
        const {
          name,
          slug,
          price,
          thumbnail,
          images,
          category,
          stock,
          brand,
          description,
        } = data;
        setName(name);
        setSlug(slug);
        setPrice(price);
        setThumbnail(thumbnail);
        setImages(images);
        setCategory(category);
        setStock(stock);
        setBrand(brand);
        setDescription(description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${BASE_API_URL}/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          thumbnail,
          images,
          category,
          brand,
          stock,
          description,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  //TODO: activate, after file upload system in backend
  // const uploadFileHandler = async (event, forImages) => {
  //   const file = event.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append("file", file);
  //   try {
  //     dispatch({ type: "UPLOAD_REQUEST" });
  //     const { data } = await axios.post(
  //       `${BASE_API_URL}/upload`,
  //       bodyFormData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form",
  //           Authorization: `Bearer ${userInfo.token}`,
  //         },
  //       }
  //     );
  //     dispatch({ type: "UPLOAD_SUCCESS" });
  //   } catch (error) {
  //     dispatch({ type: "UPLOAD_FAIL" , payload:getError(error)});
  //   }
  // };
  // const deleteFilehandler = async (fileName, f) => {
  //   setImages(images.filter((image)=>{image!==fileName}));
  //   toast.success('Image removed successfully. Click Update to applay it.');
  // };
  const updateImages = (indexOfImage, newImageLink) => {
    const oldImages = [...images];
    oldImages[indexOfImage] = newImageLink;
    return oldImages;
  };
  return (
    <Container>
      <Helmet>
        <title>Edit Product</title>
      </Helmet>
      <h1>Edit Product : {productId}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="thumbnail-link">
            <Form.Label>Thumbnail link</Form.Label>
            <Form.Control
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="other-image-link-1">
            <Form.Label>Other image link-1</Form.Label>
            <Form.Control
              value={images[0] || ""}
              onChange={(e) => {
                setImages(updateImages(0, e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="other-image-link-2">
            <Form.Label>Other image link-2</Form.Label>
            <Form.Control
              value={images[1] || ""}
              onChange={(e) => {
                setImages(updateImages(1, e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="other-image-link-3">
            <Form.Label>Other image link-3</Form.Label>
            <Form.Control
              value={images[2] || ""}
              onChange={(e) => {
                setImages(updateImages(2, e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="other-image-link-4">
            <Form.Label>Other image link-4</Form.Label>
            <Form.Control
              value={images[3] || ""}
              onChange={(e) => {
                setImages(updateImages(3, e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="other-image-link-5">
            <Form.Label>Other image link-5</Form.Label>
            <Form.Control
              value={images[4] || ""}
              onChange={(e) => {
                setImages(updateImages(4, e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="count-in-stock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
              }}
              required
            />
          </Form.Group>{" "}
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              as="textarea"
              rows={3}
              required
            />
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      )}
    </Container>
  );
};

export default ProductEditPage;
