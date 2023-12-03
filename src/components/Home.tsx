import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import moment from 'moment';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
type Report = {
  incident_report: string;
  location: string;
  datetime_occured: string;
  more_details: string;
  image: string;
  report_id: number;
};

type PoliceType = {
  police_name: string;
  assigned_location: string;
  phone_number: string;
  police_id: number;
  image: string;
};

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchReports, setSearchReports] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [storeImage, setStoreImage] = useState('');
  const [showAssignPolice, setShowAssignPolice] = useState(false);
  const [police, setPolice] = useState<PoliceType[]>([]);
  const [searchPolice, setSearchPolice] = useState('');
  const [selectedPolice, setSelectedPolice] = useState('');
  const [selectedPoliceProfile, setSelectedPoliceProfile] = useState('');

  const [seletedReportID, setSelectedReportID] = useState<number>(0);
  const [seletedPoliceID, setSelectedPoliceID] = useState<number>(0);

  const getAllReports = () => {
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/reports.php`)
      .then((res) => {
        console.log(res.data, 'reports');
        if (res.data.length > 0) {
          setReports(res.data);
        }
      });
  };

  const getAllPolice = () => {
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/police.php`)
      .then((res) => {
        console.log(res.data, 'reports');
        if (res.data.length > 0) {
          setPolice(res.data);
        }
      });
  };

  useEffect(() => {
    getAllReports();
    getAllPolice();
  }, []);

  const handleShowImage = (image: string) => {
    setStoreImage(image);
    setShowImage(true);
  };

  const handleAssignPolice = (report_id: number) => {
    setShowAssignPolice(true);
    setSelectedReportID(report_id);
  };

  const handleSelectPolice = (
    police_name: string,
    police_image: string,
    police_id: number,
  ) => {
    setSelectedPolice(police_name);
    setSelectedPoliceProfile(police_image);
    setSelectedPoliceID(police_id);
  };

  const handleAssingedPolice = () => {
    axios
      .post(`${import.meta.env.VITE_POLICE_ASSISTANCE}/assign.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        police_id: seletedPoliceID,
        report_id: seletedReportID,
      })
      .then((res) => {
        console.log(res.data);
        setShowAssignPolice(false);
        window.location.reload();
      });
  };

  return (
    <div className="relative">
      <h1 className="font-bold text-2xl">HOME</h1>

      <div className="flex justify-start items-start my-[2rem]">
        <Link to="/police">
          <Button className="w-[15rem]">Police</Button>
        </Link>
      </div>

      <div>
        <div className="flex justify-between">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="On Going">On Going</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="w-[20rem] my-2"
            placeholder="Search Reports"
            onChange={(e) => setSearchReports(e.target.value)}
          />
        </div>

        <Table className="border-2">
          <TableHeader className="bg-[#B99470] text-white">
            <TableRow>
              <TableHead className="text-white text-center">
                Incident Report
              </TableHead>
              <TableHead className="text-white text-center">Location</TableHead>

              <TableHead className="text-white text-center">
                Date/Time Occured
              </TableHead>
              <TableHead className="text-white text-center">
                More Details
              </TableHead>

              <TableHead className="text-white text-center">Image</TableHead>

              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports
              .filter((rep) => rep.incident_report.includes(searchReports))
              .map((rep, index) => (
                <TableRow key={index}>
                  <TableCell>{rep.incident_report}</TableCell>
                  <TableCell>{rep.location}</TableCell>
                  <TableCell>
                    {' '}
                    {moment(rep.datetime_occured).format('LLL')}
                  </TableCell>

                  <TableCell>{rep.more_details}</TableCell>
                  <TableCell>
                    {rep.image.length > 0 ? (
                      <a
                        onClick={() => handleShowImage(rep.image)}
                        className="underline cursor-pointer"
                      >
                        show image
                      </a>
                    ) : (
                      <p>n/a</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button className="mr-2">Solved/Done</Button>
                    <Button onClick={() => handleAssignPolice(rep.report_id)}>
                      Assign Police
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {storeImage.length > 0 && showImage && (
        <div className="absolute w-full h-screen top-0 bg-white bg-opacity-90 flex justify-center items-center">
          <div className="w-[30%] h-[30rem] bg-white rounded-xl flex flex-col justify-center items-center">
            <img
              src={storeImage}
              alt="image"
              className="w-full h-full object-cover"
            />
            <Button onClick={() => setShowImage(false)}>Close</Button>
          </div>
        </div>
      )}

      {showAssignPolice && (
        <div className="absolute w-full h-screen top-0 bg-white bg-opacity-90 flex justify-center items-center">
          <div className="p-4 w-[60%] h-fit border-2 bg-white rounded-xl flex flex-col  items-center">
            <div className="w-full">
              <div className="w-full flex justify-end">
                <Input
                  onChange={(e) => setSearchPolice(e.target.value)}
                  className="w-[15rem]"
                  placeholder="search police"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>

                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Address</TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {police
                    .filter((poli) => poli.police_name.includes(searchPolice))
                    .map((pol, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              className="w-[5rem] rounded-lg h-[5rem] object-cover"
                              src={pol.image}
                              alt={pol.image}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {pol.police_name}
                          </TableCell>
                          <TableCell>{pol.assigned_location}</TableCell>
                          <TableCell>{pol.phone_number}</TableCell>

                          <TableCell>
                            <Button
                              onClick={() =>
                                handleSelectPolice(
                                  pol.police_name,
                                  pol.image,
                                  pol.police_id,
                                )
                              }
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    .slice(0, 5)}
                </TableBody>
              </Table>
            </div>

            {selectedPolice.length > 0 && (
              <div className="w-full flex justify-start flex-col text-start my-[2rem]">
                <h1 className="font-bold">SELECTED POLICE</h1>
                <div className="w-full flex justify-start items-center">
                  <img
                    src={selectedPoliceProfile}
                    alt={selectedPoliceProfile}
                    className="w-[5rem] h-[5rem] object-cover"
                  />
                  <p className="font-bold text-2xl">{selectedPolice}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={() => setShowAssignPolice(false)}>Close</Button>
              <Button
                disabled={selectedPolice.length > 0 ? false : true}
                onClick={handleAssingedPolice}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
