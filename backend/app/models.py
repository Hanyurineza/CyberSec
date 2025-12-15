from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
    ForeignKey,
    Float,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db import Base


# =====================================
# POLICIES
# =====================================
class Policy(Base):
    __tablename__ = "policies"

    policyId = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500))
    filePath = Column(String(500), nullable=False)
    uploadedBy = Column(String(100))
    createdAt = Column(DateTime, default=datetime.utcnow)
    downloadCount = Column(Integer, default=0)

# =====================================
# USERS / STAFF
# =====================================
class User(Base):
    __tablename__ = "users"

    userId = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    passwordHash = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False)
    department = Column(String(255), nullable=True)
    createdAt = Column(DateTime, server_default=func.now())

    attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete")
    reports = relationship("Report", back_populates="user", cascade="all, delete")


# =====================================
# TOPICS
# =====================================
class Topic(Base):
    __tablename__ = "topics"

    topicId = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    link = Column(String(500), nullable=True)
    category = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)

    quizzes = relationship("Quiz", back_populates="topic", cascade="all, delete")


# =====================================
# QUIZZES
# =====================================
class Quiz(Base):
    __tablename__ = "quizzes"

    quizId = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    optionA = Column(String(255), nullable=False)
    optionB = Column(String(255), nullable=False)
    optionC = Column(String(255), nullable=False)
    optionD = Column(String(255), nullable=False)
    correctAnswer = Column(String(10), nullable=False)

    topicId = Column(Integer, ForeignKey("topics.topicId"), nullable=False)
    topic = relationship("Topic", back_populates="quizzes")

    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete")


# =====================================
# QUIZ ATTEMPTS
# =====================================
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    attemptId = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.userId"), nullable=False)
    quizId = Column(Integer, ForeignKey("quizzes.quizId"), nullable=False)
    selectedAnswer = Column(String(10), nullable=False)
    isCorrect = Column(Integer, default=0)
    createdAt = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="attempts")
    quiz = relationship("Quiz", back_populates="attempts")


# =====================================
# AWARENESS CONTENT
# =====================================
class Awareness(Base):
    __tablename__ = "awareness"

    awarenessId = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    filePath = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)


# =====================================
# AWARENESS TIPS
# =====================================
class AwarenessTip(Base):
    __tablename__ = "awareness_tips"

    tipId = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(255), nullable=True)


# =====================================
# REPORTS
# =====================================
class Report(Base):
    __tablename__ = "reports"

    reportId = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.userId"), nullable=False)
    totalAttempts = Column(Integer, default=0)
    correctCount = Column(Integer, default=0)
    awarenessScore = Column(Float, default=0.0)
    createdAt = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="reports")


# =====================================
# TRAINING
# =====================================
class Training(Base):
    __tablename__ = "training"

    trainingId = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    createdAt = Column(DateTime, server_default=func.now())
