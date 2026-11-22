package com.example.job_portal.repository;

import com.example.job_portal.entity.ResumeDocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeDocumentChunkRepository extends JpaRepository<ResumeDocumentChunk, String> {

    List<ResumeDocumentChunk> findByCandidateId(String candidateId);

    List<ResumeDocumentChunk> findByCandidateResumeId(String resumeId);

    void deleteByCandidateId(String candidateId);

    void deleteByCandidateResumeId(String resumeId);
}

