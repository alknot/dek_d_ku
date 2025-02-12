"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiService } from "@/common/apiService";

interface Application {
  id: string;
  applicantName: string;
  status: string;
  scholarshipType: string;
  requestedAmount: number;
}

const ReviewApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/request")  // Adjust the endpoint as needed
      .then(res => {
        setApplications(res.data as Application[]);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load applications. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    try{
    await apiService.requestApprove(id, true)
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'APPROVED' } : app
    ));
  }catch (e){
    setError("Failed to approve the application. Please try again.");
  }

    
    // axios.post(`/api/request/approve/${id}`, { isApproved: true })
    //   .then(() => {
    //     setApplications(applications.map(app => 
    //       app.id === id ? { ...app, status: 'APPROVED' } : app
    //     ));
    //   })
    //   .catch(() => {
    //     setError("Failed to approve the application. Please try again.");
    //   });
  };

  const handleReject = (id: string) => {
    axios.post(`/api/request/approve/${id}`, { isApproved: false })
      .then(() => {
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: 'REJECTED' } : app
        ));
      })
      .catch(() => {
        setError("Failed to reject the application. Please try again.");
      });
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Review Scholarship Applications</h1>
      {applications.map(application => (
        <div key={application.id}>
          <p>{application.applicantName} - {application.scholarshipType}</p>
          <p>Requested Amount: ${application.requestedAmount}</p>
          <p>Status: {application.status}</p>
          <button onClick={() => handleApprove(application.id)}>Approve</button>
          <button onClick={() => handleReject(application.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default ReviewApplications;
