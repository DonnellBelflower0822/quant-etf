import { Spin, TableColumnProps, Table } from "antd";
import { useRequest } from "ahooks";
import { ReturnType, getEtfList } from "../../services/api/getEtfList";
import { useLocation, useNavigate } from "react-router-dom";

const useTableParams = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const current = searchParams.get("current")
    ? Number(searchParams.get("current"))
    : 1;
  const pageSize = searchParams.get("size")
    ? Number(searchParams.get("size"))
    : 10;

  return { current, pageSize };
};

const List = () => {
  const { data } = useRequest(() => getEtfList());
  const navigate = useNavigate();

  const { current, pageSize } = useTableParams();

  if (!data) {
    return <Spin />;
  }

  const columns: TableColumnProps<ReturnType>[] = [
    {
      title: "code",
      dataIndex: "code",
      render(value: string) {
        return <a href={`/etf/${value}`}>{value}</a>;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      render(value: string, record) {
        return <a href={`/etf/${record.code}`}>{value}</a>;
      },
    },
  ];

  return (
    <div>
      <div>最近概览</div>
      <div>
        <Table
          rowKey="code"
          columns={columns}
          dataSource={data}
          pagination={{
            current,
            pageSize,
          }}
          onChange={(e) => {
            navigate(`?current=${e.current}&size=${e.pageSize}`, {
              replace: true,
            });
          }}
        />
      </div>
    </div>
  );
};
export default List;
