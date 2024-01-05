import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [displayBottomBar, setDisplayBottomBar] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://filterdeploy.azurewebsites.net/images"
        );
        setImages(response.data.images);
        setSelectedImage(response.data.images[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    const selectedImageElement = document.getElementById(
      `image-${image.file_name}`
    );

    if (selectedImageElement) {
      selectedImageElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleBottomBar = () => {
    setDisplayBottomBar(!displayBottomBar);
  };

  const handleDownload = () => {
    if (!selectedImage) return;

    axios
      .get(
        `https://filterdeploy.azurewebsites.net/download/${selectedImage.file_name}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const fileName = selectedImage.file_name;
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  return (
    <div className="App">
      {loading && (
        <div className="loadingContainer">
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
      <div className="topbar">
        <img src="/fp.svg" alt="logo" />
        <p>Welcome</p>
      </div>
      <div className="center">
        <div className="imagesContainer">
          <p>Showing {images.length - 1} photos</p>
          <img
            src={`https://filterdeploy.azurewebsites.net/image-preview/${selectedImage?.file_name}`}
            alt={selectedImage?.file_name}
            className={displayBottomBar ? "mainImage" : "mainImage full"}
          />
          {displayBottomBar ? (
            <div className="bottomBar">
              <div className="infoContainer">
                <p>9/15 in-view</p>
                <p>1 Selected/{selectedImage?.file_name}</p>
                <img
                  src="/down-arrow.png"
                  alt="left"
                  onClick={handleBottomBar}
                />
              </div>
              <div className="images">
                {images.map((image, index) => (
                  <img
                    id={`image-${image.file_name}`}
                    className={
                      selectedImage?.file_name === image.file_name
                        ? "selectedImage barImage"
                        : "barImage"
                    }
                    key={index}
                    src={`https://filterdeploy.azurewebsites.net/image-preview/${image.file_name}`}
                    alt={image.file_name}
                    onClick={() => handleImageSelect(image)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bottomBar hidden">
              <div className="infoContainer">
                <p>8/15 in-view</p>
                <p>1 Selected/{selectedImage?.file_name}</p>
                <img src="/up-arrow.png" alt="left" onClick={handleBottomBar} />
              </div>
            </div>
          )}
        </div>
        <div className="rightBar">
          <div className="top">
            <div className="line"></div>
            <div className="detailHead">
              <p>About Image</p>
            </div>
            <div className="details">
              <div className="detail">
                <p className="detailTitle">Lens</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["EXIF LensModel"]
                    ? selectedImage?.exif_info["EXIF LensModel"]
                    : selectedImage?.exif_info["MakerNote LensType"]
                    ? selectedImage?.exif_info["MakerNote LensType"]
                    : "Not Available"}
                </p>
              </div> 
              <div className="detail">
                <p className="detailTitle">Lens AF</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["MakerNote FocusMode"]
                    ? selectedImage?.exif_info["MakerNote FocusMode"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">Capture Time</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["Image DateTime"]
                    ? selectedImage?.exif_info["Image DateTime"]
                    : selectedImage?.exif_info["MakerNote DateTimeOriginal"]
                    ? selectedImage?.exif_info["MakerNote DateTimeOriginal"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">ISO</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["MakerNote ISOInfo"]
                    ? selectedImage?.exif_info["MakerNote ISOInfo"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">SpeedRating</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["EXIF ISOSpeedRatings"]
                    ? selectedImage?.exif_info["EXIF ISOSpeedRatings"]
                    : selectedImage?.exif_info["MakerNote ISOInfo"]
                    ? selectedImage?.exif_info["MakerNote ISOInfo"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">Aperature</p>
                <p className="detailValue">
                  {selectedImage?.exif_info[
                    "MakerNote LensMinMaxFocalMaxAperture"
                  ]
                    ? selectedImage?.exif_info[
                        "MakerNote LensMinMaxFocalMaxAperture"
                      ]
                    : selectedImage?.exif_info["EXIF ApertureValue"]
                    ? selectedImage?.exif_info["EXIF ApertureValue"]
                    : selectedImage?.exif_info["EXIF MaxApertureValue"]
                    ? selectedImage?.exif_info["EXIF MaxApertureValue"]
                    : selectedImage?.exif_info["Image MaxApertureValue"]
                    ? selectedImage?.exif_info["Image MaxApertureValue"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">FileName</p>
                <p className="detailValue">
                  {selectedImage?.file_name
                    ? selectedImage?.file_name
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">ImageSize</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["Image ImageWidth"]
                    ? selectedImage?.exif_info["Image ImageWidth"]
                    : selectedImage?.exif_info["EXIF ExifImageWidth"]
                    ? selectedImage?.exif_info["EXIF ExifImageWidth"]
                    : "Not Available"}
                  x
                  {selectedImage?.exif_info["Image ImageLength"]
                    ? selectedImage?.exif_info["Image ImageLength"]
                    : selectedImage?.exif_info["EXIF ExifImageLength"]}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">WhiteBalance</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["EXIF WhiteBalance"]
                    ? selectedImage?.exif_info["EXIF WhiteBalance"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">Flash</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["EXIF Flash"]
                    ? selectedImage?.exif_info["EXIF Flash"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">Copyright</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["Image Copyright"]
                    ? selectedImage?.exif_info["Image Copyright"]
                    : selectedImage?.exif_info["Image Tag 0xC6FE"]
                    ? selectedImage?.exif_info["Image Tag 0xC6FE"]
                    : "Not Available"}
                </p>
              </div>
              <div className="detail">
                <p className="detailTitle">Camera</p>
                <p className="detailValue">
                  {selectedImage?.exif_info["Image Make"] +
                  " " +
                  selectedImage?.exif_info["Image Model"]
                    ? selectedImage?.exif_info["Image Make"] +
                      " " +
                      selectedImage?.exif_info["Image Model"]
                    : "Not Available"}
                </p>
            </div>
            </div>
          </div>
          <div className="downloadContainer">
            <div className="downloadButton" onClick={handleDownload}>
              <p>Download</p>
              <img src="/right-arrow.png" alt="download" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
