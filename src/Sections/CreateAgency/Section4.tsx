import React, { FC, useContext, useEffect, useState } from "react";
import { Portfolio_Data } from "../../Utilities/utilities";
import { handleFileUploadCommon } from "../../common/common";
import { ReactComponent as PDFLogo } from "../../assets/Icons/pdf-svg.svg";
import WarningToast from "../../Components/Toast/WarningToast";
import { BeatLoader } from "react-spinners";
import { ReactComponent as RemoveIcon } from "../../assets/Icons/x.svg"
import ToastContext from "../../Context/ToastContext";
import { FileUploader } from "react-drag-drop-files";

type Section4Props = {
  formData: Record<string, any>;
  handleFileUpload: any;
  imageUrls: Record<string, any>;
  thumbnailUrls: Record<string, any>;
  setImageUrls: any;
  setThumbnailUrls: any;
  showLabels?: boolean;
  edit?: boolean;
};

const Section4: FC<Section4Props> = ({
  formData,
  handleFileUpload,
  imageUrls,
  thumbnailUrls,
  setImageUrls,
  setThumbnailUrls,
  showLabels = false,
  edit
}) => {
  const handleTitleChange = (itemIndex, title) => {
    handleFileUpload(itemIndex, "title", title);
  };

  interface FileObject {
    name: string;
    file: File;
  }

  const { examplesOfWork } = formData;
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isValidPDFSize, setIsValidPDFSize] = useState<boolean>(true);
  const [uploadLoeaders, setUploadLoeaders] = useState<{ type: string, index: number }[]>([]);
  const [isValidThumbnailSize, setIsValidThumbnailSize] =
    useState<boolean>(true);

  const [showToastForImageUrl, setShowToastForImageUrl] = useState(false);
  const [showToastForPdf, setShowToastForPdf] = useState(false);
  const [pdfError, setPDFError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isAnyDataFilled, setIsAnyDataFilled] = useState(false);

  const { showToast, hideToast } = useContext(ToastContext);

  useEffect(() => {
    for (let index = 0; index < formData?.examplesOfWork?.length; index++) {
      const e = formData?.examplesOfWork?.[index];
      if (
				e?.title !== "" ||
				(edit ? e?.image_url_1 !== "" : e?.image_url_1 !== null) ||
				(edit ? e?.image_url_2 !== "" : e?.image_url_2 !== null)
			) {
				setIsAnyDataFilled(true);
          return;
			}
    }
    setIsAnyDataFilled(false);
}, [formData?.examplesOfWork?.[0]?.title,
    formData?.examplesOfWork?.[0]?.image_url_1,
    formData?.examplesOfWork?.[0]?.image_url_2,
    formData?.examplesOfWork?.[1]?.title,
    formData?.examplesOfWork?.[1]?.image_url_1,
    formData?.examplesOfWork?.[1]?.image_url_2,
    formData?.examplesOfWork?.[2]?.title,
    formData?.examplesOfWork?.[2]?.image_url_1,
    formData?.examplesOfWork?.[2]?.image_url_2]);

  const handleFileChange = async (
    file: File[] | [],
    itemIndex: number,
    fileType: string
  ) => {
    try {
      const selectedFiles = file;

      // setUploadLoeaders([...uploadLoeaders, { type: fileType, index: itemIndex }])
      if (selectedFiles) {
        const newFiles: FileObject[] = [];

        for (let i = 0; i < selectedFiles.length; i++) {
          newFiles.push({
            name: selectedFiles[i].name,
            file: selectedFiles[i],
          });
        }
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

        for (const fileObject of newFiles) {
          if (fileType === "image_url_1") {
            // Check if the file is a PDF
            if (fileObject.file.type !== "application/pdf") {
              setIsValidPDFSize(false);
              setShowToastForPdf(true);
              setPDFError('Invalid file type. Please select a pdf file')
              return; // Exit the loop
            }
          } else if (fileType === "image_url_2") {
            // Check if the file is an image (JPEG or PNG)
            if (
              !fileObject.file.type.includes("image/jpeg") &&
              !fileObject.file.type.includes("image/png")
            ) {
              setIsValidThumbnailSize(false);
              setShowToastForImageUrl(true);
              setImageError('Invalid file type. Please select an image')
              return; // Exit the loop
            }
          }

          if (fileType === "image_url_1" || fileType === "image_url_2") {
            setUploadLoeaders([...uploadLoeaders, { type: fileType, index: itemIndex }]);
          }

          const data = await handleFileUploadCommon(fileObject.file);

          const imageUrl = data.Location;

          if (fileType === "image_url_1") {
            const maxSize = 50 * 1024 * 1024; // 20MB in bytes
            if (fileObject.file.size > maxSize) {
              setIsValidPDFSize(false);
              setShowToastForPdf(true);
              setPDFError('PDF should be less than 50 MB')
            } else {
              setShowToastForPdf(false);
              handleFileUpload(itemIndex, fileType, imageUrl);
            }
          } else if (fileType === "image_url_2") {
            const image = new Image();
            image.src = URL.createObjectURL(fileObject.file);
            await image.decode();
            if (image.width > 1000 && image.height > 1000) {

              setIsValidThumbnailSize(false);
              setShowToastForImageUrl(true);
              setImageError('Thumbnail should be less than “1000 x 1000”')
            } else {
              setShowToastForImageUrl(false);
              handleFileUpload(itemIndex, fileType, imageUrl);
            }
          }
        }

        if (fileType === "image_url_1") {
          setImageUrls((prevImageUrls) => {
            const updatedImageUrls = [...prevImageUrls];
            updatedImageUrls[itemIndex] = newFiles[0]?.file
              ? URL.createObjectURL(newFiles[0]?.file)
              : "";
            return updatedImageUrls;
          });
        } else if (fileType === "image_url_2") {
          setThumbnailUrls((prevThumbnailUrls) => {
            const updatedThumbnailUrls = [...prevThumbnailUrls];
            updatedThumbnailUrls[itemIndex] = newFiles[0]?.file
              ? URL.createObjectURL(newFiles[0]?.file)
              : "";
            return updatedThumbnailUrls;
          });
        }
      }
      let tempArr = uploadLoeaders
      setUploadLoeaders([...tempArr.filter((_item, _) => { return (_item.type === fileType && _item.index === itemIndex) })])


    } catch (error) {
      console.error("An error occurred while handling the file:", error);
    }
  };

  useEffect(() => {
    if (showToastForPdf) {
      const timeout = setTimeout(() => {
        setShowToastForPdf(false);
      }, 3000);

      return () => clearTimeout(timeout);
    } else if (showToastForImageUrl) {
      const timeout = setTimeout(() => {
        setShowToastForImageUrl(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showToastForImageUrl, showToastForPdf]);

  useEffect(() => {
    console.log(uploadLoeaders, "uploadLoeaders");

  }, [uploadLoeaders])


  return (
    <>
      {showToastForPdf && (
        <WarningToast toastMessage={pdfError} />
      )}

      {showToastForImageUrl && (
        <WarningToast
          toastMessage={imageError}
        />
      )}
      <div className="mx-[5%] xl:mx-auto mt-10" style={{width:'100%'}}>
        <h5 className="text-[16px] font-montserrat min-w-[400px] font-semibold mb-2 flex items-center justify-center text-center">
          Add up to 3 examples of your work
        </h5>
        <p className="text-[14px] font-medium text-[#667085] font-montserrat flex items-center justify-center text-center min-w-[380px]">
          These can be case studies, portfolio works, or anything you would like
          to showcase.
        </p>
        <div className="grid grid-cols-12 gap-5 mx-[5%] mt-5">
          {Portfolio_Data?.map((item, itemIndex) => {
            const exampleOfWork = formData?.examplesOfWork[itemIndex];
            const isTitleValid = exampleOfWork?.title !== "";
            const isPdfValid = edit ? exampleOfWork?.image_url_1 !== "" : exampleOfWork.image_url_1 !== null;
            const isThumbnailValid = edit ? exampleOfWork?.image_url_2 !== "" : exampleOfWork.image_url_2 !== null;

            // Determine if any field has been filled for the current object
            const anyFieldFilled =
            isAnyDataFilled && (!isTitleValid || !isPdfValid || !isThumbnailValid);

            return (
              <div
                key={itemIndex}
                className="col-span-12 w-[350px] md:w-full mx-auto md:col-span-4"
              >
                <span className="text-[14px] font-montserrat font-semibold text-[#000] flex items-center justify-center mb-2">
                  {item.heading}
                </span>
                <div>
                  <input
                    id="name"
                    placeholder="Add title"
                    className="block w-full px-2 py-2 text-gray-900 border
                       border-[#D0D5DD]
                     rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.examplesOfWork[itemIndex].title}
                    onChange={(e) =>
                      handleTitleChange(itemIndex, e.target.value)
                    }
                  />
                  {showLabels && (
                    <p
                      style={{ height: "42px" }}
                      className={`${anyFieldFilled && !isTitleValid
                        ? "text-[#f04438]"
                        : "text-[#667085]"
                        } text-[14px] mt-2 font-medium font-montserrat`}
                    >
                      {anyFieldFilled && !isTitleValid
                        ? "Please enter your title."
                        : !anyFieldFilled
                          ? "This title will show up in your work spotlight."
                          : "\u00A0"}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-center mt-5" style={{ position: "relative" }}>
                    {(formData.examplesOfWork[itemIndex].image_url_1 && uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_1" && _item.index === itemIndex) }).length <= 0) &&
                      <RemoveIcon style={{ cursor: "pointer", position: "absolute", zIndex: "5", width: "25px", height: "25px", right: "calc(50% - 35px)", top: "10px" }}
                        onClick={() => {
                          handleFileUpload(itemIndex, "image_url_1", edit ? "" : null)
                        }} />}

                    <div
                      className="w-[100%] h-[100%]"
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", top: 0 }}
                    >
                      <FileUploader
                        id={`file_${itemIndex}`}
                        multiple={true}
                        handleChange={(file) => {
                          handleFileChange(file, itemIndex, "image_url_1")
                        }}
                        types={["PDF",]}
                        disabled={uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_1" && _item.index === itemIndex) }).length > 0}
                        onTypeError={(err) => {
                          showToast(`${err}`, "warn");
                          setTimeout(() => {
                            hideToast();
                          }, 3000);
                        }}
                      />
                    </div>

                    <label
                      role="button"
                      htmlFor={`file_${itemIndex}`}
                      className={`h-[130px] w-full border   ${anyFieldFilled && !isPdfValid
                        ? "border-[#f04438]"
                        : "border-[#D0D5DD]"
                        } rounded-[8px] flex justify-center`}
                      style={{ alignItems: "center" }}
                    >
                      {
                        uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_1" && _item.index === itemIndex) }).length > 0
                          ?
                          <div className="h-[100%] w-[100%] flex justify-center" style={{ alignItems: "center" }}>
                            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                          </div>
                          :
                          <div>
                            <div className="flex justify-center">
                              <span className="shadow-md border border-[#D0D5DD] rounded-[8px] h-[40px] w-[40px] flex justify-center items-center">
                                {formData.examplesOfWork[itemIndex].image_url_1 ? (
                                  <PDFLogo />
                                ) : (
                                  <img
                                    alt=""
                                    className="w-100 h-100 object-contain"
                                    src={
                                      require("../../assets/Icons/upload-cloud-icon.svg")
                                        .default
                                    }
                                  />
                                )}
                              </span>
                            </div>
                            <div className="flex justify-center">
                              <p className="text-[14px] font-semibod font-montserrat mt-3 text-center">
                                <span className="text-[14px] font-semibod text-[#329BFA] font-montserrat">
                                  {item.file}
                                </span>
                                <br />
                                <span className="text-[#667085] text-sm font-montserrat">
                                  PDF should be less than 50 MB
                                </span>
                              </p>
                            </div>
                          </div>
                      }
                    </label>
                  </div>
                  {/* {showLabels && (
                    <p
                      style={{ height: "42px" }}
                      className={`${anyFieldFilled && (!isPdfValid)
                        ? "text-[#f04438]"
                        : "text-[#667085]"
                        } text-[14px] mt-2 font-medium font-montserrat`}
                    >
                      {anyFieldFilled && (!isPdfValid)
                        ? "Please upload file."
                        : !anyFieldFilled
                          ? "PDF should be less than 20 MB"
                          : "\u00A0"}
                    </p>
                    //here
                  )} */}

                  {showLabels && (
                    <p
                      style={{ height: "42px" }}
                      className={`${anyFieldFilled && (!isPdfValid)
                        ? "text-[#f04438]"
                        : "text-[#667085]"
                        } text-[14px] mt-2 font-medium font-montserrat`}
                    >
                      {anyFieldFilled && (!isPdfValid)
                        ? "Please upload file."
                        : "\u00A0"}
                    </p>
                    //here
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-center mt-5" style={{ position: "relative" }}>
                    {(formData.examplesOfWork[itemIndex].image_url_2 && uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_2" && _item.index === itemIndex) }).length <= 0)
                      && <RemoveIcon style={{ cursor: "pointer", position: "absolute", zIndex: "5", width: "25px", height: "25px", right: "calc(50% - 35px)", top: "10px" }}
                        onClick={() => {
                          handleFileUpload(itemIndex, "image_url_2", edit ? "" : null)
                        }}

                      />}
                    <div
                      className="w-[100%] h-[100%]"
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", top: 0 }}
                    >
                      <FileUploader
                        id={`thumbnail_${itemIndex}`}
                        multiple={true}
                        handleChange={(file) => {
                          handleFileChange(file, itemIndex, "image_url_2")
                        }}
                        types={["JPEG", "PNG", "JPG"]}
                        disabled={uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_2" && _item.index === itemIndex) }).length > 0}
                        onTypeError={(err) => {
                          showToast(`${err}`, "warn");
                          setTimeout(() => {
                            hideToast();
                          }, 3000);
                        }}
                      />
                    </div>
                    <label
                      role="button"
                      htmlFor={`thumbnail_${itemIndex}`}
                      className={`h-[130px] w-full border ${anyFieldFilled && !isThumbnailValid
                        ? "border-[#f04438]"
                        : "border-[#D0D5DD]"
                        } rounded-[8px] flex justify-center`}
                      style={{ alignItems: "center" }}
                    >
                      {
                        uploadLoeaders.filter((_item, _) => { return (_item.type === "image_url_2" && _item.index === itemIndex) }).length > 0
                          ?
                          <div className="h-[100%] w-[100%] flex justify-center" style={{ alignItems: "center" }}>
                            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                          </div>
                          :
                          <div>
                            <div className="flex justify-center">
                              <span className="shadow-md border border-[#D0D5DD] rounded-[8px] h-[40px] w-[40px] flex justify-center items-center">
                                <img
                                  alt=""
                                  className={`${formData.examplesOfWork[itemIndex].image_url_2
                                    ? "w-5 h-5"
                                    : "h-100 w-100"
                                    }   object-contain`}
                                  src={
                                    formData.examplesOfWork[itemIndex]
                                      .image_url_2 ||
                                    require("../../assets/Icons/upload-cloud-icon.svg")
                                      .default
                                  }
                                />
                              </span>
                            </div>
                            <div className="flex justify-center">
                              <p className="text-[14px] font-semibod font-montserrat mt-3 text-center">
                                <span className="text-[14px] font-semibod text-[#329BFA] font-montserrat">
                                  {item.thumbnail}
                                </span>
                                <br />
                                <span className="text-[#667085] text-sm font-montserrat">
                                  Thumbnail should be less than “1000 x 1000”
                                </span>
                              </p>
                            </div>
                          </div>
                      }
                    </label>
                  </div>
                  {/* {showLabels && (
                    <p
                      style={{ height: "42px" }}
                      className={`${anyFieldFilled && (!isThumbnailValid)
                        ? "text-[#f04438]"
                        : "text-[#667085]"
                        } text-[14px] mt-2 font-medium font-montserrat`}
                    >
                      {anyFieldFilled && (!isThumbnailValid)
                        ? "Please upload thumbnail."
                        : !anyFieldFilled
                          ? " Thumbnail should be less than “1000 x 1000”"
                          : "\u00A0"}
                    </p>
                  )} */}

                  {showLabels && (
                    <p
                      style={{ height: "42px" }}
                      className={`${anyFieldFilled && (!isThumbnailValid)
                        ? "text-[#f04438]"
                        : "text-[#667085]"
                        } text-[14px] mt-2 font-medium font-montserrat`}
                    >
                      {anyFieldFilled && (!isThumbnailValid)
                        ? "Please upload thumbnail."
                        : "\u00A0"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Section4;
