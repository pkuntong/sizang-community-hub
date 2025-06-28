import React from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Textarea } from "@heroui/react";
import { useAuth } from '../../components/auth/auth-context';
import { Report } from '../../types/models';

export const AdminReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: Report['status'], notes?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        await fetchReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'primary';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'default';
      default:
        return 'default';
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Report Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <Table aria-label="Reports table">
              <TableHeader>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>REASON</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(report.status)}>
                        {report.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => setSelectedReport(report)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {selectedReport && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Review Report</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Report Details</h3>
                  <p>Type: {selectedReport.type}</p>
                  <p>Reason: {selectedReport.reason}</p>
                  <p>Reported on: {new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>

                <Textarea
                  label="Notes"
                  placeholder="Add notes about this report..."
                  defaultValue={selectedReport.notes}
                />

                <div className="flex gap-2">
                  <Button
                    color="success"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                  >
                    Resolve
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                  >
                    Dismiss
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    onClick={() => setSelectedReport(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};