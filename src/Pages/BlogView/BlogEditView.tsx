import React, { useContext, useEffect, useMemo, useState } from "react";
import { ReactComponent as PlusIcon } from "../../assets/Icons/plus.svg";
import { ReactComponent as TrashIcon } from "../../assets/Icons/Trash.svg";
import { ReactComponent as LeftArrow } from "../../assets/Icons/left-arrow.svg";
import { ReactComponent as MinusArrow } from "../../assets/Icons/minus-circle.svg";
import { ReactComponent as DnDArrow } from "../../assets/Icons/DnD.svg";

import fileUpload from "../../assets/Icons/upload_to_cloud.svg";
import "./style.css";
import { title } from "process";
import SpinnerContext from "../../Context/SpinnerContext";
import { handleFileUploadCommon } from "../../common/common";
import BlogSection from "./BlogSection";
import { log } from "console";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import ToastContext from "../../Context/ToastContext";
import { FileUploader } from "react-drag-drop-files";
import { integer } from "aws-sdk/clients/cloudfront";
import Loading from "../../Loading";

import { ReactComponent as RemoveIcon } from "../../assets/Icons/x.svg";
import ReactQuill from 'react-quill';

type sectionObj = {
  title: string;
  content: string;
  image: string;
};

let draggedItem: sectionObj | null = null;

type ContainerProps = {
  _blog: any; //👈 children prop typr
};

const UPDATE_BLOG = gql`
  mutation UpdateBlog($id: Float!, $data: CreateBlogInput!) {
    updateBlog(id: $id, data: $data) {
      id
      title
      description
      image
      created_at
      updated_at
      created_by
      updated_by
      deleted
      sections {
        id
        blogId
        title
        content
        image
      }
    }
  }
`;

const GET_BLOG = gql`
  query GetBlog($id: Float!) {
    getBlog(id: $id) {
      id
      title
      description
      image
      created_by
      updated_by
      deleted
      # Add other fields you want to retrieve here
      sections {
        id
        title
        content
        deleted
        blogId
        image
        # Add other fields from the 'sections' model if needed
      }
    }
  }
`;

const BlogEditView = () => {
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [updateBlog] = useMutation(UPDATE_BLOG);
  const [blogSections, setBlogSections] = useState<sectionObj[]>([]);
  const navigate = useNavigate();

  const { showToast, hideToast } = useContext(ToastContext);

  const [file, setFile] = useState<File | null>(null);
  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
  const [fileValidation, setFileValidation] = useState(true);
  const [sectionIndexesForfileValidation, setSectionIndexesForFileValidation] =
    useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [fileUploadProcessing, setfileUploadProcessing] = useState(false);
  const [fileUploadProcessings, setfileUploadProcessings] = useState<string[]>(
    []
  );

  const { id } = useParams();
  const [isComponentInIFrame, setIsComponentInIFrame] = useState(false);

  const {
    data: getBlogsData,
    loading,
    error,
  } = useQuery(GET_BLOG, {
    variables: { id: parseInt(`${id}`) },
  });

  const [blogValidation, setblogValidation] = useState({
    title: false,
    image: false,
    description: false,
  });

  useEffect(() => {
    if (getBlogsData?.getBlog) {
      setBlog({
        title: getBlogsData?.getBlog?.title,
        description: getBlogsData?.getBlog?.description,
        image: getBlogsData?.getBlog?.image,
      });
      setBlogSections([...getBlogsData?.getBlog?.sections]);
    }
  }, [getBlogsData]);

  const handleFileChange = async (file) => {
    try {
      setfileUploadProcessing(true);
      let img = new Image();
      let _file = file;
      if (_file) {
        img.src = window.URL.createObjectURL(_file);
        img.onload = async () => {
          if (img.width > 800 || img.height > 400) {
            setFileValidation(false);
            showToast(
              "Please upload image having size of max 800x400px",
              "warn"
            );
            setTimeout(() => {
              hideToast();
            }, 3000);
          } else {
            const data = await handleFileUploadCommon(_file);
            setBlog({ ...blog, image: data.Location });
            setFile(_file);
            setFileValidation(true);
          }

          setfileUploadProcessing(false);
        };
      }
    } catch (error) {
      console.error("An error occurred while handling the file:", error);
      setfileUploadProcessing(false);
    }
  };

  const onChageBlogSectionImageHandle = async (file, index) => {
    try {
      setfileUploadProcessings([...fileUploadProcessings, `${index}`]);
      let tempSections = blogSections;
      let tempSection = blogSections[index];
      let img = new Image();
      let _file = file;
      if (_file) {
        img.src = window.URL.createObjectURL(_file);
        img.onload = async () => {
          if (img.width > 800 || img.height > 400) {
            let arr = sectionIndexesForfileValidation;
            arr?.push(index);
            setSectionIndexesForFileValidation([...arr]);
            showToast(
              "Please upload image having size of max 800x400px",
              "warn"
            );
            setTimeout(() => {
              hideToast();
            }, 3000);
          } else {
            const data = await handleFileUploadCommon(_file);
            tempSections[index] = { ...tempSection, image: data.Location };
            setBlogSections([...tempSections]);
            setSectionIndexesForFileValidation([
              ...sectionIndexesForfileValidation.filter((item, _) => {
                return item !== index;
              }),
            ]);
          }
          setfileUploadProcessings([
            ...fileUploadProcessings.filter((item, _) => {
              return item !== `${index}`;
            }),
          ]);
        };
      }
    } catch (error) {
      console.error("An error occurred while handling the file:", error);
      setfileUploadProcessings([
        ...fileUploadProcessings.filter((item, _) => {
          return item !== `${index}`;
        }),
      ]);
    }
  };

  const onChageBlogSectionHandle = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    let tempSections = blogSections;
    let tempSection = blogSections[index];
    if (e.target.name === "title") {
      tempSections[index] = { ...tempSection, title: e.target.value };
    }
    // else if (e.target.name === "content") {
    //   tempSections[index] = { ...tempSection, content: e.target.value };
    // } 
    else {
      tempSections[index] = { ...tempSection, [e.target.name]: e.target.value };
    }

    setBlogSections([...tempSections]);
  };

  const onChangeBlogContentHandle = (value: string, index: number) => {
    let tempSections = blogSections;
    let tempSection = blogSections[index];
    tempSections[index] = { ...tempSection, content: value };
    setBlogSections([...tempSections]);
  }

  const removeSectionImage = (index) => {
    let tempSections = blogSections;
    let tempSection = blogSections[index];
    tempSections[index] = { ...tempSection, image: "" };
    setBlogSections([...tempSections]);
  };

  const Button = ({
    title,
    preIcon,
    onClick,
    type,
  }: {
    title: String;
    preIcon?: any;
    onClick?: any;
    type?: String;
  }) => {
    return (
      <button
        className={
          type === "secondaryBtn"
            ? "secondaryBtn"
            : type === "dangerBtn"
              ? "dangerBtn"
              : "primaryBtn"
        }
        onClick={onClick}
      >
        {preIcon && <>{preIcon}</>}
        <span>{title}</span>
      </button>
    );
  };

  const handleDragStart = (item: sectionObj) => {
    draggedItem = item;
  };

  const handleDragEnd = () => {
    draggedItem = null;
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    event.preventDefault();

    if (draggedItem) {
      const newItems = [...blogSections];
      newItems.splice(
        dropIndex,
        0,
        newItems.splice(blogSections.indexOf(draggedItem), 1)[0]
      );
      setBlogSections([...newItems]);
    }
  };

  const blogSectionsMemo = useMemo(() => {
    console.log(blogSections, "blogSections memo");
    return (
      <div
        id="drag-container"
        className="w-[100%] flex gap-[24px] drag-container"
        style={{ flexDirection: "column" }}
      >
        {blogSections &&
          blogSections.map((section, index) => {
            return (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(section)}
                onDragEnd={handleDragEnd}
                onDragOver={(event) => handleDragOver(event, index)}
              >
                <BlogSection
                  key={index}
                  index={index}
                  onChageBlogSectionHandle={onChageBlogSectionHandle}
                  onChageBlogSectionImageHandle={(file) => {
                    onChageBlogSectionImageHandle(file, index);
                  }}
                  onChangeBlogContentHandle={onChangeBlogContentHandle}
                  sectionTitle={section?.title}
                  sectionDescription={section.content}
                  sectionImage={section.image}
                  fileValidation={
                    sectionIndexesForfileValidation?.includes(index)
                      ? false
                      : true
                  }
                  processing={
                    fileUploadProcessings.filter((item, _) => {
                      return item === `${index}`;
                    }).length > 0
                  }
                  removeBtn={
                    <Button
                      title={"Remove section"}
                      preIcon={<MinusArrow />}
                      type="dangerBtn"
                      onClick={() => {
                        let arr = blogSections;
                        arr?.splice(index, 1);
                        setBlogSections([...arr]);
                      }}
                    />
                  }
                  onRemoveImage={() => {
                    removeSectionImage(index);
                  }}
                />
              </div>
            );
          })}
      </div>
    );
  }, [blogSections, sectionIndexesForfileValidation, fileUploadProcessings]);

  const params = useParams();
  const saveBlog = async () => {
    console.log(blog.description.replace(/<[^>]+>/g, '') !== "", "123");

    try {
      setProcessing(true);
      if (blog.title !== "" && (blog.description.replace(/<[^>]+>/g, '') !== "") && blog.image !== "") {
        const data = {
          title: blog.title,
          description: blog.description,
          image: blog.image,
          sections: blogSections.map((section, _) => {
            return {
              title: section.title || "",
              content: section.content || "",
              image: section.image || "",
              deleted: false,
            };
          }),
          created_by: getBlogsData?.getBlog?.created_by || "",
          updated_by: getBlogsData?.getBlog?.created_by || "",
          deleted: getBlogsData?.getBlog?.deleted || false,
        };
        console.log(data, "data");

        const result = await updateBlog({
          variables: {
            id: parseInt(`${params.id}`),
            data: data,
          },
        });
        setProcessing(false);
        showToast("Blog created successfully", "success");
        setTimeout(() => {
          hideToast();
        }, 3000);
      } else {
        setblogValidation({
          title: blog.title === "" ? true : false,
          description: (!blog.description.replace(/<[^>]+>/g, '')) ? true : false,
          image: blog.image === "" ? true : false,
        });
        setTimeout(() => {
          setProcessing(false);
          showToast(
            `Blog${blog.title === ""
              ? ` Title${blog.image === "" || blog.description.replace(/<[^>]+>/g, '') === "" ? "," : ""
              }`
              : ""
            }${blog.image === ""
              ? ` Image${blog.description.replace(/<[^>]+>/g, '') === "" ? "," : ""}`
              : ""
            }${blog.description.replace(/<[^>]+>/g, '') === "" ? ` Description` : ""} ${(blog.title === "" && blog.description.replace(/<[^>]+>/g, '') === "") ||
              (blog.title === "" && blog.image === "") ||
              (blog.image === "" && blog.description.replace(/<[^>]+>/g, '') === "")
              ? "are"
              : "is"
            } required.`,

            "warn"
          );
          setTimeout(() => {
            hideToast();
          }, 3000);
        }, 250);
      }
    } catch (error) {
      setProcessing(false);
      console.error("Mutation Error:", error);
      showToast("Blog update fail!", "warn");
      setTimeout(() => {
        hideToast();
      }, 3000);
    }
  };

  useEffect(() => {
    setblogValidation({
      title: blog.title === "" ? blogValidation.title : false,
      description: (!blog.description.replace(/<[^>]+>/g, '')) ? blogValidation.description : false,
      image: blog.image === "" ? blogValidation.image : false,
    });
  }, [blog]);

  if (error) return <p>Error: {error?.message}</p>;
  if (loading) return <Loading />;

  return (
    <div
      className="flex blog-container-view"
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "32px",
      }}
    >
      <div
        className="flex"
        style={{
          flexDirection: "column",
          width: "100%",
          maxWidth: "1216px",
          gap: "24px",
        }}
      >
        <div className="blog-view-header">
          <div className="blog-view-header-left">
            <LeftArrow
              style={{ cursor: "pointer" }}
              onClick={() => {
                sessionStorage.setItem("update", "true");
                navigate("/blogs");
              }}
            />
            <input
              value={blog.title}
              style={{
                borderColor: blogValidation.title ? "red" : "#D0D5DD",
                outline: "none",
              }}
              onChange={(e) => {
                setBlog({ ...blog, title: e.target.value });
              }}
              placeholder="Add blog title"
            />
          </div>
          <div
            className="w-[100%] flex justify-end"
            style={{ height: "41px", alignItems: "center" }}
          >
            {processing ? (
              <BeatLoader
                color="#3364F7"
                cssOverride={{}}
                loading
                speedMultiplier={0.5}
              />
            ) : (
              <Button title={"Save"} onClick={saveBlog} />
            )}
          </div>
        </div>
        <div
          className="image-upload"
          style={{ borderColor: blogValidation.image ? "red" : "#D0D5DD" }}
        >
          {fileUploadProcessing ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BeatLoader
                color="#3364F7"
                cssOverride={{}}
                loading
                speedMultiplier={0.5}
              />
            </div>
          ) : (
            <>
              <div className="image-upload-inner" style={{ opacity: 10 }}>
                {blog.image && (
                  <RemoveIcon
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      zIndex: "5",
                      width: "25px",
                      height: "25px",
                      right: "calc(50% - 35px)",
                      top: "32px",
                    }}
                    onClick={() => {
                      setBlog({ ...blog, image: "" });
                    }}
                  />
                )}
                <div
                  className="w-[100%] h-[100%]"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    cursor: "pointer",
                    top: 0,
                  }}
                >
                  <FileUploader
                    id="blog-image"
                    multiple={false}
                    handleChange={handleFileChange}
                    name="blog-image"
                    types={["JPEG", "PNG", "JPG"]}
                    onTypeError={(err) => {
                      showToast(`${err}`, "warn");
                      setTimeout(() => {
                        hideToast();
                      }, 3000);
                    }}
                  />
                </div>
                <div className="rounded-lg border-[1px] border-grayBorder px-2 py-2">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      style={{ width: "32px", height: "32px" }}
                    />
                  ) : (
                    <img src={fileUpload} alt="File upload" className="w-5" />
                  )}
                </div>
                <label
                  htmlFor="file-input"
                  className="font-inter not-italic leading-5 text-sm  text-gray700 grid grid-cols-[auto_auto] justify-center justify-self-center items-center gap-2 shadow-shadowXs"
                  style={{ marginTop: "12px" }}
                >
                  <span style={{ color: "#2E5ADE", fontWeight: "600" }}>
                    Click to upload
                  </span>
                  or drag and drop
                </label>
                <label
                  htmlFor="file-input"
                  className="font-inter not-italic leading-5 text-sm  text-gray700 grid grid-cols-[auto_auto] justify-center justify-self-center items-center gap-2 shadow-shadowXs"
                  style={{
                    marginTop: "4px",
                    color: fileValidation ? "#475467" : "red",
                  }}
                >
                  PNG, JPG (max. 800x400px)
                </label>
              </div>
            </>
          )}
        </div>
        <ReactQuill
          placeholder="Enter a description..."
          value={blog.description}
          onChange={(e) => {
            setBlog({ ...blog, description: e });
          }}
        />
        {/* <textarea
          style={{
            borderColor: blogValidation.description ? "red" : "#D0D5DD",
            outline: "none",
          }}
          placeholder="Enter a description..."
          value={blog.description}
          onChange={(e) => {
            setBlog({ ...blog, description: e.target.value });
          }}
        ></textarea> */}

        {blogSectionsMemo}
        <div className="w-[100%] flex justify-end">
          <Button
            title={"Add new section"}
            preIcon={<PlusIcon fill="#344054" />}
            type="secondaryBtn"
            onClick={() => {
              const _sections = [
                ...blogSections,
                { title: "", content: "", image: "" },
              ];
              setBlogSections([..._sections]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogEditView;
