import React from "react";
import { CircleDollar } from "@gravity-ui/icons";
import { Card, Link } from "@heroui/react";
import DefImage from "../../assets/download.jpeg";

const PLACEHOLDER_IMAGE = DefImage;

export default function Comments({ topComment }) {
  return (
    <div className="mb-2 bg-gray-200 rounded p-2 rounded-2xl">
      <div className="flex items-center gap-3 border-b pb-2 border-gray-300">
        <img
          alt="Indie Hackers community"
          className="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
          loading="lazy"
          src={topComment?.commentCreator.photo}
          onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
        />
        <Card.Header>
          <Card.Title>{topComment?.commentCreator.name}</Card.Title>
          <Card.Description>
            {topComment?.createdAt
              .split("T")
              .join(" ")
              .split(".")
              .join(" ")
              .split(":")
              .slice(0, 2)
              .join(":")}
          </Card.Description>
        </Card.Header>
      </div>
      <Card.Description className="break-words p-2 rounded-b">
        {topComment.content && topComment.content}
        {topComment.image && (
          <img
            className="w-100 mt-3 h-100 mx-auto"
            src={topComment.image}
            alt={topComment.content}
            loading="lazy"
          />
        )}
      </Card.Description>
    </div>
  );
}
