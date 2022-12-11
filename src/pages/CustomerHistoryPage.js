import React from "react";
import { useSearchParams } from "react-router-dom";
import { CustomerHistory } from "../components/CustomerHistory";

const convertParamsForHistory = () => {
  const [params] = useSearchParams();
  const obj = {};
  if (params.get("customer")) {
    obj.id = params.get("customer");
  }
  return obj;
};
export const CustomerHistoryPage = (props) => {
  return (
    <CustomerHistory {...convertParamsForHistory()} />
  );
};
