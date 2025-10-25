import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const getVisitors = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/visitors`, { params });
  return res.data;
};

export const getVisitor = async (id) => {
  const res = await axios.get(`${API_BASE}/visitors/${id}`);
  return res.data;
};

export const createVisitor = async (data) => {
  const res = await axios.post(`${API_BASE}/visitors`, data);
  return res.data;
};

export const updateVisitor = async (id, data) => {
  const res = await axios.put(`${API_BASE}/visitors/${id}`, data);
  return res.data;
};

export const deleteVisitor = async (id) => {
  const res = await axios.delete(`${API_BASE}/visitors/${id}`);
  return res.data;
};
