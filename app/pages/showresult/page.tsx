"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Application {
  id: string;
  scholarshipName: string;
  status: string;
  requestedAmount: number;
}

const TrackApprovalStatus = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/user/applications")  // Adjust this endpoint to match your API structure
      .then(res => {
        setApplications(res.data as Application[]);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load applications. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Track Your Application Status</h1>
      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            <h2>{application.scholarshipName} - Requested: ${application.requestedAmount}</h2>
            <p>Status: <strong>{application.status}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackApprovalStatus;
