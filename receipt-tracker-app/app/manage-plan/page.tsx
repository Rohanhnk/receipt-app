import SchematicComponent from "@/components/schematic/SchematiComponent";
import React from "react";

function ManagePlan() {
  return (
    <div className="container xl:mx-w-5xlmx-auto p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-4 my-8 ">Manage Your Plan</h1>
      <p className="text-grey-600 mb-8">
        Manage your subscription and billing details here.
      </p>
      <SchematicComponent
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPONENT_ID
        }
      />
    </div>
  );
}

export default ManagePlan;
