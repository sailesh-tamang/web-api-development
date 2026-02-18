"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../../lib/useAuth";
import AdminLayout from "../../component/admin/AdminLayout";
import styles from "../../component/admin/UsersTable.module.css";
import Link from "next/link";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function AdminUsersPage() {
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth?page=${page}&limit=${limit}`);
      const data = await res.json();
      
      if (data.ok) {
        setUsers(data.users || []);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalUsers: data.totalUsers,
        });
      } else {
        console.error("Failed to fetch users:", data.message);
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers(pagination.currentPage, itemsPerPage);
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user");
    }
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    fetchUsers(1, limit);
  };

  useEffect(() => {
    if (!ready) return;
    fetchUsers(1, itemsPerPage);
  }, [ready]);

  if (!ready) {
    return (
      <AdminLayout currentPage="Users">
        <div className={styles.loadingState}>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <AdminLayout currentPage="Users">
      <div className={styles.container}>
        <h1 className={styles.title}>User Management</h1>

        {/* Controls */}
        <div className={styles.controlsSection}>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={styles.select}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className={styles.paginationInfo}>
            Total Users: <strong>{pagination.totalUsers}</strong>
          </div>
          <Link href="/admin/users/create" className={`${styles.actionButton} ${styles.editButton}`} style={{ marginLeft: "auto" }}>
            + Create User
          </Link>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className={styles.loadingState}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name || "-"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/users/${user._id}`} className={`${styles.actionButton} ${styles.viewButton}`}>
                        View
                      </Link>
                      <Link href={`/admin/users/${user._id}/edit`} className={`${styles.actionButton} ${styles.editButton}`}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className={styles.paginationSection}>
          <div className={styles.paginationControls}>
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className={styles.pageButton}
            >
              ← Prev
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageButton} ${page === pagination.currentPage ? styles.active : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className={styles.pageButton}
            >
              Next →
            </button>
          </div>
          <div className={styles.pageIndicator}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
