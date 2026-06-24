"""
Job Management Routes.

POST /jobs/           — Create a new job
GET  /jobs/           — List all jobs
GET  /jobs/{job_id}   — Get job by ID
PUT  /jobs/{job_id}   — Update a job
DELETE /jobs/{job_id} — Delete a job
"""

from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import get_current_user
from src.schemas.job import JobCreate, JobResponse, JobUpdate
from src.services.job_service import JobService

router = APIRouter()
service = JobService()


@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, user=Depends(get_current_user)):
    return service.create_job(job.model_dump())


@router.get("/", response_model=list[JobResponse])
def get_jobs(user=Depends(get_current_user)):
    return service.get_jobs()


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, user=Depends(get_current_user)):
    job = service.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: str, job_update: JobUpdate, user=Depends(get_current_user)):
    updated = service.update_job(job_id, job_update.model_dump(exclude_unset=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return updated


@router.delete("/{job_id}")
def delete_job(job_id: str, user=Depends(get_current_user)):
    deleted = service.delete_job(job_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return {"success": True, "message": f"Job {job_id} deleted successfully"}
