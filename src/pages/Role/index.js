import React, { useState, useMemo, useCallback, Fragment } from "react";
import { connect } from "dva";
import _ from "lodash";
import { formatMessage } from "umi/locale";
import { Form, Col, Checkbox, Tooltip } from "antd";
import moment from "moment";
import router from "umi/router";

import PageContainer from "@/components/PageContainer";

import { extractFilterQueryString } from "@/utils/utils";
import IconButton from "@/components/IconButton";

import PageContent from "@/components/PageContent";
import Search from "@/components/FilterHeader/Search";
import FilterHeader from "@/components/FilterHeader";
import QueryTable from "@/components/QueryTable";
import * as permission from "@/services/permission";
import * as role from "@/services/role";
import { useQueryTableChange, useQuery } from "@/components/QueryTable/hooks";
import useDataService from "use-data-service";
import FullSpin from "@/components/FullSpin";
import CreateRole from "./CreateRole";
import CreatePermission from "./CreatePermission";
import RoleTitle from "./RoleTitle";

function RolePage({ location }) {
  const [roleIsLoading, roles] = useDataService(role.all);

  const columns = useMemo(
    () => [
      {
        title: formatMessage({ id: "module.role.grid.permission" }),
        sorter: true,
        dataIndex: "title",
        fixed: "left",
        width: 200
      },
      ..._.map(roles, role => ({
        title: <RoleTitle>{role.title}</RoleTitle>,
        dataIndex: "id",
        align: "center",
        render(permissionId) {
          return (
            <div title={`${role.id}-${permissionId}`}>
              <Checkbox />
            </div>
          );
        }
      })),
      {
        dataIndex: "id",
        fixed: "right",
        width: 100,
        render() {
          return (
            <Fragment>
              <IconButton icon="fa::edit" />
              &nbsp;&nbsp;&nbsp;
              <IconButton icon="fa::trash" />
            </Fragment>
          );
        }
      }
    ],
    [roles]
  );

  const handleQueryChange = useQueryTableChange(location);
  const [filterQuery, handleQuery] = useQuery(null, handleQueryChange);

  return (
    <PageContainer title={formatMessage({ id: "module.role.pageTitle" })}>
      <PageContent>
        <FilterHeader
          actions={
            <div>
              <CreateRole />
              <CreatePermission />
            </div>
          }
        >
          <Search
            placeholder={formatMessage({ id: "module.role.search.query" })}
            defaultValue={filterQuery}
            onSearch={handleQuery}
          />
        </FilterHeader>

        {roleIsLoading ? (
          <FullSpin />
        ) : (
          <QueryTable
            service={permission.queryAll}
            params={extractFilterQueryString(location.query)}
            onChange={handleQueryChange}
            columns={columns}
          />
        )}
      </PageContent>
    </PageContainer>
  );
}

export default RolePage;
