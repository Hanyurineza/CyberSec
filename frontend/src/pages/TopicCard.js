import React from "react";
import { motion } from "framer-motion";

function TopicCard({ topic, onEdit, onDelete }) {
  return (
    <motion.div
      className="card topic-card shadow-sm mb-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-body">
        <h5 className="card-title text-primary">{topic.title}</h5>
        <p className="card-text text-muted mb-3">{topic.description}</p>

        {topic.link && (
          <a
            href={topic.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary me-2"
          >
            View Material
          </a>
        )}

        {onEdit && (
          <button
            className="btn btn-sm btn-outline-success me-2"
            onClick={() => onEdit(topic)}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(topic.topicId)}
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
export default TopicCard;
