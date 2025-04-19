import React, { useState } from 'react';
import dummy from '../../assets/images/dummy-post-square-1-thegem-blog-masonry.jpg';
import FileViewer from 'react-file-viewer';
import downloadIcon from '../../assets/Icons/download.png';
import { ReactComponent as DownloadIcon } from "../../assets/Icons/Featured icon.svg"
import CustomModal from '../../Components/Modal/CustomModal';

const Section5 = ({ pageContent }) => {
	const type = 'pdf';
	const [showPdf, setShowPdf] = useState(false);
	const [isOpen, setisOpen] = useState(false)
	const [pdfLink, setpdfLink] = useState<string | null>("")
	const [selectedPDF, setselectedPDF] = useState<any | null>(null)

	return (
		<>
			{isOpen && <CustomModal isOpen={isOpen} title={selectedPDF?.title} onClose={() => { setisOpen(false); setpdfLink("") }} onSubmit={() => { }} type={"pdf-view"} pdfLink={pdfLink} />}
			{
				(pageContent?.portfolio?.length > 0 && pageContent?.portfolio?.filter((item, _) => { return (item.title === "") }).length < 3) &&

				<>

					<div id='portfolio' className='  max-w-[1216px] mt-10'>
						<h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2'>
							Work Spotlight
						</h6>
						<div className='grid grid-cols-12 gap-[20px]'>
							{pageContent?.portfolio?.map((item) => (
								<div
									className='col-span-12 md:col-span-6 lg:col-span-4'
									style={{ overflow: 'hidden' }}
									onClick={() => { setselectedPDF(item) }}
								>
									<div className='w-full h-[298px] relative'>
										<div className='absolute z-10 bg-[#000] bg-opacity-25 h-[40px] w-full bottom-[0px] flex items-center justify-center'>
											<span className='flex items-center justify-center text-[#FFFFFF] font-montserrat font-normal text-[16px]'>
												{item.title}
											</span>
										</div>
										{showPdf ? (
											<div>
												{item.image_url_1.toLowerCase().endsWith('.pdf') ? (
													<FileViewer fileType={type} filePath={item.image_url_1} />
												) : (
													<img
														alt=''
														className='object-cover rounded-[8px]'
														style={{ height: '100%', width: '100%' }}
														src={item.image_url_2 ? item.image_url_2 : dummy}
													/>
												)}
											</div>
										) : (
											<>
												{/* {(item.image_url_1) &&
													<a
														href={item.image_url_1}
														download
														target='_blank'
														rel='noreferrer'
													>
														<DownloadIcon style={{
															position: 'absolute',
															top: '15px',
															right: '10px',
														}} />
													</a>
												} */}
												<img
													onClick={() => { if (item.image_url_1 !== "") { setisOpen(true); setpdfLink(`${item.image_url_1}`) } }}
													alt=''
													className='object-fill rounded-[8px]'
													style={{ height: '100%', width: '100%', cursor: "pointer" }}
													src={item.image_url_2 ? item.image_url_2 : dummy}
												/>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			}
		</>
	);
};

export default Section5;
