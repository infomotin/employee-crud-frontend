import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/employeeApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown } from "lucide-react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const itemsPerPage = 5;

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter logic
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.detail?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort logic
  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...filteredEmployees];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties for sorting (e.g., detail.salary)
        if (sortConfig.key.includes('.')) {
           const keys = sortConfig.key.split('.');
           aValue = a;
           bValue = b;
           keys.forEach(k => {
             aValue = aValue ? aValue[k] : '';
             bValue = bValue ? bValue[k] : '';
           });
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">Employees</CardTitle>
        <Button asChild>
          <Link to="/create">Add Employee</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Filter by name, email, or designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('id')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => requestSort('email')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  Email <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead onClick={() => requestSort('detail.designation')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  Designation <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => requestSort('detail.salary')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  Salary <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                currentEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>{emp.detail?.designation}</TableCell>
                    <TableCell>{emp.detail?.salary}</TableCell>
                    <TableCell>{emp.detail?.address}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/edit/${emp.id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEmployee(emp.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmployeeList;
