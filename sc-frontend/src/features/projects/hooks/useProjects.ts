"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import { projectsApi } from "../api/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    projectsApi
      .list()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}
