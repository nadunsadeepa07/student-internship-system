import React, {
  useEffect,
  useState,
} from "react";

import { useParams }
  from "react-router-dom";

import api from "../utils/api";

import CVPreview
  from "../components/cv/CVPreview";

export default function SharedCVPage() {

  const { token } = useParams();

  const [cv, setCv] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchSharedCV();

  }, []);

  const fetchSharedCV =
    async () => {

      try {

        const { data } =
          await api.get(
            `/cv/shared/${token}`
          );

        setCv(data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

  if (loading) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading CV...
      </div>
    );
  }

  if (!cv) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        CV not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <CVPreview
          cvData={cv}
          template={cv.template}
          sections={[
            "personal",
            "summary",
            "skills",
            "experience",
            "education",
            "projects",
          ]}
        />
      </div>
    </div>
  );
}