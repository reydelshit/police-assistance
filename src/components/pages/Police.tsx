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
      <h1 className="font-bold text-2xl">Police</h1>
      <div className="flex gap-4 mt-[5rem]">
        <div className="w-[30rem] border-2 p-4">
          <form className="text-start" onSubmit={handleSubmit}>
            <div className="my-2">
              <Label>Police Name:</Label>
              <Input required name="police_name" onChange={handleInputChange} />
            </div>

            <div className="my-2">
              <Label>Location:</Label>
              <Input
                required
                name="assigned_location"
                onChange={handleInputChange}
              />
            </div>

            <div className="my-2">
              <Label>Phone:</Label>
              <Input
                required
                name="phone_number"
                onChange={handleInputChange}
              />
            </div>

            <div className="my-2">
              <Label>Image(optional)</Label>
              <Input
                onChange={handleChangeImage}
                required
                type="file"
                accept="image/*"
              />
            </div>

            <div className="my-2 w-full flex items-center justify-center">
              <Button className="w-[10rem]">Submit</Button>
            </div>
          </form>
        </div>

        <div className="w-full">
          <div className="w-full flex justify-end">
            <Input
              onChange={(e) => setSearchPolice(e.target.value)}
              className="w-[15rem]"
              placeholder="search police"
            />
          </div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
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
                        <Button className="mr-2">Edit</Button>
                        <Button>Delete</Button>
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
