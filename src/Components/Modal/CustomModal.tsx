import React, { useContext, useEffect, useState } from "react";
import { Modal, Box, Select, MenuItem } from '@mui/material';
import { ReactComponent as CrossBtnIcon } from "../../assets/Icons/x-btn.svg"
import { ReactComponent as ContactUsIcon } from "../../assets/Icons/Featured icon (1).svg"

import { ReactComponent as LeftIcon } from "../../assets/Icons/arrow-left.svg"
import { ReactComponent as RightIcon } from "../../assets/Icons/arrow-right.svg"


import { ReactComponent as PDFIcon } from "../../assets/Icons/pdf-viwer.svg"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import "./modal.css"
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

interface ModalProps {
    isOpen?: any, onClose?: any, onSubmit?: any, type?: any, pdfLink?: any, title?: any
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const CustomModal = ({ isOpen, onClose, onSubmit, type, pdfLink, title }: ModalProps) => {

    const [ticketType, setTicketType] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdf, setPdf] = useState<any>("");

    useEffect(() => {

        return () => {
            setTicketType("")
            setDescription("")
        }

    }, [])

    useEffect(() => {
        if (type === "pdf-view" && pdfLink) {
            axios.get(pdfLink, { responseType: 'blob' }).then((response) => {
                console.log(response, "response");

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdf(url);
            });
        }
    }, [pdfLink]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    if (type === "pdf-view") {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                className='custom-modal'
            >
                <div className='contact-us-modal-container modal-pdf font-inter'>
                    <div className=" w-[100%] flex" style={{ justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAECF0", paddingBottom: "20px" }}>
                        <span className="font-inter" style={{ color: "#101828", fontSize: "18px", fontWeight: "600" }}>{title}</span>
                        <CrossBtnIcon style={{ cursor: "pointer" }}
                            onClick={() => {
                                setTicketType("")
                                setDescription("")
                                onClose()
                            }} />
                    </div>
                    <div className="con custom-scroll-bar">
                        {
                            pdf &&
                            <>
                                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page pageNumber={pageNumber} />
                                </Document>
                            </>
                        }
                    </div>
                    <div className="w-[100%] flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span></span>
                        <div className="flex">
                            <div style={{ border: "1px solid #D0D5DD", padding: "10px 16px", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", cursor: pageNumber === 1 ? "not-allowed" : "pointer" }}
                                onClick={() => {
                                    if (1 < pageNumber) { setPageNumber(pageNumber - 1) }
                                }}
                            >
                                <LeftIcon stroke={pageNumber === 1 ? "rgb(102, 112, 133)" : "#344054"} />
                            </div>
                            <div style={{ border: "1px solid #D0D5DD", padding: "10px 16px", borderLeft: "none", borderTopRightRadius: "8px", borderBottomRightRadius: "8px", cursor: pageNumber === numPages ? "not-allowed" : "pointer" }} onClick={() => {
                                if (pageNumber < numPages) { setPageNumber(pageNumber + 1) }
                            }}>
                                <RightIcon stroke={pageNumber === numPages ? "rgb(102, 112, 133)" : "#344054"} />
                            </div>
                        </div>
                        <span className="font-inter " style={{
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "24px",
                            color: "#667085"
                        }}>{pageNumber}/{numPages} pages</span>
                    </div>
                </div>
            </Modal>
        );
    }
    else if (type === 'custom') {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                className='custom-modal'
            >
                <div className='contact-us-modal-container font-inter'>
                    {/* <div className=" w-[100%] flex" style={{ justifyContent: "flex-end", alignItems: "center" }}>
                        <CrossBtnIcon style={{ cursor: "pointer" }}
                            onClick={() => {
                                setTicketType("")
                                setDescription("")
                                onClose()
                            }} />
                    </div> */}


                    <div className="w-[100%] flex type-of-tickets" style={{ alignItems: "center", flexDirection: "column", gap: "10px", marginBottom: "25px" }} >
                        <span className="title font-inter">
                            {title}
                        </span>
                    </div>
                    <div className="btn-container flex" >
                        <button className="cancel"
                            onClick={() => {
                                onClose()
                            }}
                        >
                            No
                        </button>
                        <button className="submit"
                            onClick={() => { onSubmit() }}>Yes</button>
                    </div>
                </div>
            </Modal>
        )
    }
    else {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                className='custom-modal'
            >
                <div className='contact-us-modal-container font-inter'>
                    <div className=" w-[100%] flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        {/* <ContactUsIcon /> */}
                        <span className="title font-inter">
                            Contact us
                        </span>
                        <CrossBtnIcon style={{ cursor: "pointer" }}
                            onClick={() => {
                                setTicketType("")
                                setDescription("")
                                onClose()
                            }} />
                    </div>

                    <div className="w-[100%] flex type-of-tickets" style={{ alignItems: "flex-start", flexDirection: "column", gap: "10px" }} >
                        <span className="header">Type of ticket<span style={{ color: "#D92D20" }}>*</span></span>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ticketType}
                            label="Select Ticket Type"
                            onChange={(event) => {
                                const { target: { value } } = event;
                                setTicketType(`${value}`)
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                            displayEmpty
                        >
                            <MenuItem disabled value="">
                                <em>Select a ticket</em>
                            </MenuItem>
                            <MenuItem value={"Report a Bug"}>Report a Bug</MenuItem>
                            <MenuItem value={"Request a feature"}>Request a feature</MenuItem>
                            <MenuItem value={"Billing & subscription"}>Billing & subscription</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </div>
                    <div className="w-[100%] flex type-of-tickets" style={{ alignItems: "flex-start", flexDirection: "column", gap: "10px" }} >
                        <span className="header">Description<span style={{ color: "#D92D20" }}>*</span></span>
                        <textarea placeholder="Enter detailed description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    </div>
                    <div className="btn-container flex" >
                        <button className="cancel"
                            onClick={() => {
                                setTicketType("")
                                setDescription("")
                                onClose()
                            }}
                        >Cancel</button>
                        <button title="Please Select Type of Ticket and Enter the Description" disabled={(ticketType === "" || description === "")} style={{ opacity: (ticketType === "" || description === "") ? 0.6 : 1 }} className="submit" onClick={() => { onSubmit(ticketType, description) }}>Submit</button>
                    </div>
                </div>
            </Modal>
        );
    }
};

export default CustomModal;
