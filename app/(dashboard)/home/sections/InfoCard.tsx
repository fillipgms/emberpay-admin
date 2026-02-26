import React from "react";

const InfoCard = ({
    title,
    value,
    compare,
}: {
    title: string;
    value: string;
    compare?: string;
}) => {
    return (
        <div className="infocard">
            <p>{title}</p>
            <h2 className="font-bold text-2xl">R$ {value}</h2>
        </div>
    );
};

export default InfoCard;
