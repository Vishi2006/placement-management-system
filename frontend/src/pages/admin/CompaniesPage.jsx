import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import EmptyState from '../../components/common/EmptyState'
import { companyApi } from '../../services/api'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({ name: '', location: '', website: '', hrEmail: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const load = () => companyApi.getAll().then((res) => setCompanies(res.data || []))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Company name is required')
      return
    }

    try {
      if (editingId) {
        await companyApi.update(editingId, form)
        toast.success('Company updated successfully')
      } else {
        await companyApi.create(form)
        toast.success('Company created successfully')
      }
      setForm({ name: '', location: '', website: '', hrEmail: '', description: '' })
      setEditingId(null)
      setIsOpen(false)
      load()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save company')
    }
  }

  const handleEdit = (company) => {
    setForm(company)
    setEditingId(company._id)
    setIsOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyApi.delete(id)
        toast.success('Company deleted successfully')
        load()
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete company')
      }
    }
  }

  const closeModal = () => {
    setForm({ name: '', location: '', website: '', hrEmail: '', description: '' })
    setEditingId(null)
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Companies Management</h2>
        <button onClick={() => setIsOpen(true)} className="btn-primary">+ Add Company</button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass w-full max-w-md rounded-2xl border p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">{editingId ? 'Edit Company' : 'Add Company'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input"
                placeholder="Company Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input
                className="input"
                placeholder="Website URL"
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <input
                className="input"
                placeholder="HR Email"
                type="email"
                value={form.hrEmail}
                onChange={(e) => setForm({ ...form, hrEmail: e.target.value })}
              />
              <textarea
                className="input"
                placeholder="Description"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companies List */}
      {companies.length === 0 ? (
        <EmptyState title="No companies yet" description="Create your first company to get started." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900">
              <tr>
                <th className="p-3">Name</th>
                <th>Location</th>
                <th>Email</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="p-3 font-medium">{company.name}</td>
                  <td className="text-slate-600">{company.location || '-'}</td>
                  <td className="text-sm text-slate-600">{company.hrEmail || '-'}</td>
                  <td className="text-sm">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(company)}
                        className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
