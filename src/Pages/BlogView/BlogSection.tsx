import React, { useContext } from 'react'
import { ReactComponent as MinusArrow } from "../../assets/Icons/minus-circle.svg"
import { ReactComponent as DnDArrow } from "../../assets/Icons/DnD.svg"
import fileUpload from "../../assets/Icons/upload_to_cloud.svg";
import { FileUploader } from 'react-drag-drop-files';
import { BeatLoader } from 'react-spinners';
import { ReactComponent as RemoveIcon } from '../../assets/Icons/x.svg';
import ToastContext from '../../Context/ToastContext';
import ReactQuill from 'react-quill';


export default function BlogSection(
    { sectionTitle, sectionDescription, sectionImage, index, onChageBlogSectionHandle, onDragEnd, fileValidation, removeBtn, onChageBlogSectionImageHandle, processing, onRemoveImage, onChangeBlogContentHandle }:
        { sectionTitle?: string, sectionDescription?: string, sectionImage?: string, index?: any, onChageBlogSectionHandle?: any, onDragEnd?: any, fileValidation?: any, removeBtn?: any, onChageBlogSectionImageHandle?: any, processing?: any, onRemoveImage?: any, onChangeBlogContentHandle: any }

) {


    const { showToast, hideToast } = useContext(ToastContext);

    return (

        <div className={`section-container `} >
            <div className='w-[100%] flex justify-between' style={{ alignItems: "center" }}>
                <DnDArrow style={{ cursor: "move" }} />
                {removeBtn}
            </div>

            <input name='title' value={sectionTitle} onChange={(e) => { onChageBlogSectionHandle(e, index) }}
                placeholder='Add blog title' />
            <div className='image-upload'>
                {
                    processing
                        ?
                        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                        </div>
                        :
                        <>
                            {/* {sectionImage && <img src={sectionImage} />} */}
                            <div className='image-upload-inner' style={{ opacity: 10 }}>
                                {(sectionImage) && <RemoveIcon style={{ cursor: "pointer", position: "absolute", zIndex: "5", width: "25px", height: "25px", right: "calc(50% - 35px)", top: "32px" }}
                                    onClick={onRemoveImage} />}
                                <div
                                    className="w-[100%] h-[100%]"
                                    style={{ position: "absolute", opacity: 0, cursor: "pointer", top: 0 }}
                                >
                                    <FileUploader
                                        style={{ width: "100%" }}
                                        multiple={false}
                                        handleChange={onChageBlogSectionImageHandle}
                                        name="file"
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
                                    {
                                        sectionImage
                                            ?
                                            <img src={sectionImage} style={{ width: "32px", height: "32px" }} />
                                            :
                                            <img
                                                src={fileUpload}
                                                alt="File upload"
                                                className="w-5"
                                            />
                                    }
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
                                    style={{ marginTop: "4px", color: fileValidation ? "#475467" : "red" }}
                                >
                                    PNG, JPG (max. 800x400px)
                                </label>
                            </div>
                        </>
                }

            </div>
            <ReactQuill
                placeholder='Enter a description...'
                value={sectionDescription}
                onChange={(e) => { onChangeBlogContentHandle(e, index) }}
                style={{ width: '100%' }}
            />
            {/* <textarea name='content' placeholder='Enter a description...' value={sectionDescription} onChange={(e) => { onChageBlogSectionHandle(e, index) }}></textarea> */}
        </div>
    )
}
