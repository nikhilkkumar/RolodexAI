"use client"

import { useState, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, X, Edit2, Save, Clock } from "lucide-react"

interface Interaction {
  id: string
  date: string
  topics: string[]
  medium: string
}

interface Contact {
  id: string
  name: string
  profilePicture: string
  email?: string
  phone?: string
  socials: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  personalSite?: string
  notes: string
  tags: string[]
  howWeMet: string
  interactions: Interaction[]
}

export default function RolodexDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Alice Johnson",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "alice@example.com",
      phone: "(555) 123-4567",
      socials: { linkedin: "alice-johnson", twitter: "alicejohnson", instagram: "alice.j" },
      personalSite: "https://alicejohnson.com",
      notes: "Interested in AI and machine learning.",
      tags: ["Tech", "AI", "Networking"],
      howWeMet: "Met at Mercury Founders Event",
      interactions: [
        { id: "1", date: "2023-06-15", topics: ["AI", "Startup funding"], medium: "In-person" },
        { id: "2", date: "2023-07-01", topics: ["Machine learning", "Conference"], medium: "Video call" },
      ]
    },
    {
      id: "2",
      name: "Bob Smith",
      profilePicture: "/placeholder.svg?height=40&width=40",
      phone: "(555) 987-6543",
      socials: { linkedin: "bob-smith", instagram: "bobsmith" },
      notes: "Works in finance. Loves hiking and photography.",
      tags: ["Finance", "Outdoors", "Photography"],
      howWeMet: "College roommate",
      interactions: [
        { id: "1", date: "2023-05-20", topics: ["Hiking trip", "Investment advice"], medium: "Phone call" },
      ]
    },
  ])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [newContact, setNewContact] = useState<Partial<Contact>>({})
  const [newTag, setNewTag] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [newInteraction, setNewInteraction] = useState<Partial<Interaction>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddContact = () => {
    if (newContact.name) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString(), tags: [], socials: {}, interactions: [] } as Contact])
      setNewContact({})
    }
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  const handleAddTag = () => {
    if (newTag && selectedContact) {
      const updatedContact = { ...selectedContact, tags: [...selectedContact.tags, newTag] }
      updateContact(updatedContact)
      setNewTag("")
    }
  }

  const handleDeleteTag = (contactId: string, tagToDelete: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      const updatedContact = { ...contact, tags: contact.tags.filter(tag => tag !== tagToDelete) }
      updateContact(updatedContact)
    }
  }

  const updateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c))
    setSelectedContact(updatedContact)
    setEditingContact(null)
  }

  const handleEditContact = () => {
    if (selectedContact) {
      setEditingContact({ ...selectedContact })
    }
  }

  const handleSaveContact = () => {
    if (editingContact) {
      updateContact(editingContact)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editingContact) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingContact({ ...editingContact, profilePicture: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddInteraction = () => {
    if (selectedContact && newInteraction.date && newInteraction.medium) {
      const updatedContact = {
        ...selectedContact,
        interactions: [
          ...selectedContact.interactions,
          { ...newInteraction, id: Date.now().toString(), topics: newInteraction.topics || [] } as Interaction
        ]
      }
      updateContact(updatedContact)
      setNewInteraction({})
    }
  }

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Rolodex AI</h1>
      
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Name"
          value={newContact.name || ""}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          className="max-w-xs"
        />
        <Input
          placeholder="Email (optional)"
          value={newContact.email || ""}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          className="max-w-xs"
        />
        <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <Input
        placeholder="Search by name, email, or tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Interaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id} className="cursor-pointer hover:bg-blue-100">
              <TableCell onClick={() => setSelectedContact(contact)}>
                <div className="flex items-center">
                  <Avatar className="mr-2">
                    <AvatarImage src={contact.profilePicture} alt={contact.name} />
                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {contact.name}
                </div>
              </TableCell>
              <TableCell onClick={() => setSelectedContact(contact)}>{contact.email || 'N/A'}</TableCell>
              <TableCell onClick={() => setSelectedContact(contact)}>
                {contact.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="mr-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 p-0 h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTag(contact.id, tag)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </TableCell>
              <TableCell onClick={() => setSelectedContact(contact)}>
                {contact.interactions.length > 0
                  ? new Date(contact.interactions[contact.interactions.length - 1].date).toLocaleDateString()
                  : 'No interactions'}
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDeleteContact(contact.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedContact} onOpenChange={() => {
        setSelectedContact(null)
        setEditingContact(null)
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedContact?.name}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                {editingContact ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-4">
                        <Avatar className="w-32 h-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <AvatarImage src={editingContact.profilePicture} alt={editingContact.name} />
                          <AvatarFallback>{editingContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editingContact.name}
                          onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          value={editingContact.email || ''}
                          onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          value={editingContact.phone || ''}
                          onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-how-we-met">How We Met</Label>
                        <Input
                          id="edit-how-we-met"
                          value={editingContact.howWeMet || ''}
                          onChange={(e) => setEditingContact({ ...editingContact, howWeMet: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-linkedin">LinkedIn</Label>
                        <Input
                          id="edit-linkedin"
                          value={editingContact.socials.linkedin || ''}
                          onChange={(e) => setEditingContact({
                            ...editingContact,
                            socials: { ...editingContact.socials, linkedin: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-twitter">Twitter</Label>
                        <Input
                          id="edit-twitter"
                          value={editingContact.socials.twitter || ''}
                          onChange={(e) => setEditingContact({
                            ...editingContact,
                            socials: { ...editingContact.socials, twitter: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-instagram">Instagram</Label>
                        <Input
                          id="edit-instagram"
                          value={editingContact.socials.instagram || ''}
                          onChange={(e) => setEditingContact({
                            ...editingContact,
                            socials: { ...editingContact.socials, instagram: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-personal-site">Personal Site</Label>
                        <Input
                          id="edit-personal-site"
                          value={editingContact.personalSite || ''}
                          onChange={(e) => setEditingContact({ ...editingContact, personalSite: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Input
                          id="edit-notes"
                          value={editingContact.notes}
                          onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveContact} className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Avatar className="w-32 h-32 mb-4">
                        
                        <AvatarImage src={selectedContact.profilePicture} alt={selectedContact.name} />
                        <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <p><strong>Email:</strong> {selectedContact.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {selectedContact.phone || 'N/A'}</p>
                      <p><strong>How We Met:</strong> {selectedContact.howWeMet || 'N/A'}</p>
                      <div className="mt-4">
                        <strong>Social Links:</strong>
                        <ul>
                          {Object.entries(selectedContact.socials).map(([platform, username]) => (
                            username && (
                              <li key={platform}>
                                <a href={`https://www.${platform}.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </a>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                      {selectedContact.personalSite && (
                        <div className="mt-2">
                          <strong>Personal Site:</strong>{' '}
                          <a href={selectedContact.personalSite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedContact.personalSite}
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>Notes:</strong>
                      <p className="mt-2">{selectedContact.notes}</p>
                      <div className="mt-4">
                        <strong>Tags:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedContact.tags.map(tag => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 p-0 h-4 w-4"
                                onClick={() => handleDeleteTag(selectedContact.id, tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Input
                          placeholder="New tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="max-w-xs"
                        />
                        <Button onClick={handleAddTag} className="bg-blue-600 hover:bg-blue-700">
                          Add Tag
                        </Button>
                      </div>
                      <Button onClick={handleEditContact} className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Contact
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="interactions">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Add New Interaction</h3>
                    <div className="flex space-x-2">
                      <Input
                        type="date"
                        value={newInteraction.date || ''}
                        onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
                      />
                      <Input
                        placeholder="Topics (comma-separated)"
                        value={newInteraction.topics?.join(', ') || ''}
                        onChange={(e) => setNewInteraction({ ...newInteraction, topics: e.target.value.split(',').map(t => t.trim()) })}
                      />
                      <Input
                        placeholder="Medium"
                        value={newInteraction.medium || ''}
                        onChange={(e) => setNewInteraction({ ...newInteraction, medium: e.target.value })}
                      />
                      <Button onClick={handleAddInteraction} className="bg-blue-600 hover:bg-blue-700">
                        Add Interaction
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Interaction Log</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Topics</TableHead>
                          <TableHead>Medium</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedContact.interactions.map((interaction) => (
                          <TableRow key={interaction.id}>
                            <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{interaction.topics.join(', ')}</TableCell>
                            <TableCell>{interaction.medium}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}