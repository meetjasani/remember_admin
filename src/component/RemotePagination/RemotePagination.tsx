import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { memeberManagment } from '../../pages/member/MemberManagement';
import { memorialHallManagment } from '../../pages/memorial-hall-list/memorialHallManagement';
import { terminationMemberMng } from '../../pages/termination/MemberMngment';
import { IconsultationListData } from '../../pages/consultation/ConsultationListManagement';
import { donationHistoryData } from '../../pages/memorial-hall-list/memorial-hall-detail/DonationHistory';
import { albumVideoData } from '../../pages/memorial-hall-list/memorial-hall-detail/Album_Video';
import { memorialPostData } from '../../pages/memorial-hall-list/memorial-hall-detail/MemorialPost';
import { funeralListData } from '../../pages/funeral-news/FuneralNewsManagement';
interface Props {
  data: memeberManagment[] | terminationMemberMng[] | memorialHallManagment[] | IconsultationListData[] | memorialPostData[] | albumVideoData[] | donationHistoryData[] | funeralListData[];
  columns: any
  onTableChange: (page?: any, sizePerPage?: any) => void;
  totalSize?: any;
  pagesizedropdownflag: boolean
  selectRow: any;
  rowEvents: any;
  pageName: any;
}


const RemotePagination: React.FC<Props> = ({ data, columns, onTableChange, totalSize, pagesizedropdownflag, selectRow, rowEvents, pageName }) => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const onPageChange = (pageNumber: any) => {
    setPage(pageNumber);
    onTableChange(pageNumber, sizePerPage);
  }
  const onSizePerPageChange = (sizeperpage: any) => {
    setSizePerPage(sizeperpage)
    setPage(1);
    onTableChange(1, sizeperpage);
  }

  const tableRowEvents = {
    onClick: (e: any, row: any, rowIndex: any) => {
    }
  }

  return (
    <div>
      <PaginationProvider
        pagination={
          paginationFactory({
            custom: true,
            page,
            sizePerPage,
            totalSize,
            sizePerPageList: [{
              text: '10개', value: 10
            }, {
              text: '50개', value: 50
            }, {
              text: '100개', value: 100
            }
            ],
            alwaysShowAllBtns: true,
          })
        }
      >
        {
          ({
            paginationProps,
            paginationTableProps
          }) => (
            <div>
              <BootstrapTable
                {...paginationTableProps}
                remote
                keyField="id"
                data={data}
                columns={columns}
                onTableChange={() => onTableChange(page, sizePerPage)}
                rowEvents={tableRowEvents}
                selectRow={selectRow}
              />
              <div className="paginationcustom">
                <PaginationListStandalone
                  {...paginationProps}
                  onPageChange={(p) => onPageChange(p)}
                />
                {totalSize > 0 && pagesizedropdownflag &&
                  <SizePerPageDropdownStandalone
                    {...paginationProps}
                    onSizePerPageChange={(e) => onSizePerPageChange(e)}
                  />
                }

              </div>
            </div>
          )
        }
      </PaginationProvider>
    </div>
  )
};

export default RemotePagination;