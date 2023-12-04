import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import axios from 'axios';

type EventChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

type PoliceType = {
  police_name: string;
  assigned_location: string;
  phone_number: string;
  police_id: number;
  image: string;
};
export default function Police() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [policeDetails, setPoliceDetails] = useState({
    police_name: '',
    assigned_location: '',
    phone_number: '',
  });
  const [searchPolice, setSearchPolice] = useState('');

  const [police, setPolice] = useState<PoliceType[]>([]);

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

  const handleInputChange = (e: EventChange) => {
    const { name, value } = e.target;
    console.log(name, value);
    setPoliceDetails((values) => ({ ...values, [name]: value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('dsadas');
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_POLICE_ASSISTANCE}/police.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...policeDetails,
        image,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    getAllPolice();
  }, []);

  return (
    <div>
      <div className="w-full bg-[#125B50] p-4 rounded-lg text-white">
        <h1 className="font-bold text-4xl text-start">Police</h1>
        <p className="text-start">Manage Police</p>
      </div>

      <div className="flex gap-4 mt-[5rem]">
        <div className="w-[30rem] border-2 p-4 bg-[#125B50] text-white rounded-lg">
          <form className="text-start" onSubmit={handleSubmit}>
            <div className="my-2">
              <Label>Police Name:</Label>
              <Input
                className="bg-white text-black"
                required
                name="police_name"
                onChange={handleInputChange}
              />
            </div>

            <div className="my-2">
              <Label>Location:</Label>
              <Input
                className="bg-white text-black"
                required
                name="assigned_location"
                onChange={handleInputChange}
              />
            </div>

            <div className="my-2">
              <Label>Phone:</Label>
              <Input
                className="bg-white text-black"
                required
                name="phone_number"
                onChange={handleInputChange}
              />
            </div>

            <div className="my-2">
              <Label>Image(optional)</Label>
              <Input
                className="bg-white text-black"
                onChange={handleChangeImage}
                required
                type="file"
                accept="image/*"
              />
            </div>

            <div className="my-2 w-full flex items-center justify-center">
              <Button className="w-[10rem] bg-white text-black">Submit</Button>
            </div>
          </form>
        </div>

        <div className="w-full">
          <div className="w-full flex justify-end">
            <Input
              onChange={(e) => setSearchPolice(e.target.value)}
              className="w-[15rem] my-4"
              placeholder="search police"
            />
          </div>
          <Table>
            <TableHeader className="bg-[#125B50] text-white">
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center text-white">Name</TableHead>
                <TableHead className="text-center text-white">
                  Address
                </TableHead>
                <TableHead className="text-center text-white">Phone</TableHead>
                <TableHead className="text-center text-white">
                  Actions
                </TableHead>
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
                        <Button className="mr-2 bg-[#125B50]">Edit</Button>
                        <Button className="bg-[#125B50]">Delete</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
