from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# =============================
# TOPICS
# =============================
class TopicBase(BaseModel):
    title: str
    description: str | None = None
    link: str | None = None
    category: str | None = None
    file_path: str | None = None
class TopicCreate(TopicBase):
    pass
class TopicOut(TopicBase):
    topicId: int

    class Config:
        from_attributes = True
# =============================
# POLICIES
# =============================
class PolicyOut(BaseModel):
    policyId: int
    title: str
    description: Optional[str] = None
    filePath: str
    uploadedBy: Optional[str] = None
    createdAt: datetime
    downloadCount: int 
class Config:
        from_attributes = True

# =============================
# USERS / STAFF
# =============================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str] = None
    role: str = "Staff"   # Staff | Admin | SuperAdmin


class UserCreate(UserBase):
    password: Optional[str] = None


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserOut(BaseModel):
    userId: int
    name: str
    email: EmailStr
    department: Optional[str]
    role: str
    createdAt: datetime

    class Config:
        from_attributes = True


# =============================
# AUTH
# =============================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class LoginResponse(BaseModel):
    token: str
    user: UserOut
    
# =============================
# QUIZZES
# =============================
class QuizBase(BaseModel):
    question: str
    optionA: str
    optionB: str
    optionC: str
    optionD: str
    correctAnswer: str
    topicId: int


class QuizCreate(QuizBase):
    pass


class QuizOut(QuizBase):
    quizId: int

    class Config:
        from_attributes = True


# =============================
# QUIZ ATTEMPTS
# =============================
class AttemptCreate(BaseModel):
    userId: int
    quizId: int
    selectedAnswer: str


class AttemptOut(BaseModel):
    attemptId: int
    userId: int
    quizId: int
    selectedAnswer: str
    isCorrect: int
    createdAt: datetime

    class Config:
        from_attributes = True


# =============================
# REPORTS
# =============================
class ReportOut(BaseModel):
    reportId: int
    userId: int
    totalAttempts: int
    correctCount: int
    awarenessScore: float
    createdAt: datetime

    class Config:
        from_attributes = True


# =============================
# TRAINING
# =============================
class TrainingBase(BaseModel):
    title: str
    description: str


class TrainingOut(TrainingBase):
    trainingId: int

    class Config:
        from_attributes = True
