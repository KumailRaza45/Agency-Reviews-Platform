import { useState } from "react";

const CollapseButton: React.FC<any> = ({
	desc,
	length = 160,
	label = "Read",
}) => {
	const [showFullDescription, setFullDescription] = useState(false);

	const showFullDescriptionHandler = () => {
		setFullDescription(!showFullDescription);
	};

	const description =
		desc.length > length
			? showFullDescription
				? desc
				: `${desc.slice(0, length)}...`
			: desc;

	return (
		<div className="col-md-7">
			<p className="lead">{description}</p>
			<button
				className="collapse-button text-[14px] font-semibold font-montseorrat text-[#329BFA] cursor-pointer ml-auto mt-2"
				onClick={showFullDescriptionHandler}
			>
				{desc.length > length
					? `${label} ${showFullDescription ? "Less" : "More"}`
					: ""}
			</button>
		</div>
	);
};

export default CollapseButton;
