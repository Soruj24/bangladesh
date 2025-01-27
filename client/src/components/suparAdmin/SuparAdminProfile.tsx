import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SuperAdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, Cityville",
    bio: "Super Administrator with 10+ years of experience managing global teams.",
    role: "Super Admin",
    image: "/user.png",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handelResetPassword = () => {
    alert("Password reset coming soon!");
  };  

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <Card className="p-4 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={profile.image}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border"
            />
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0"
                onClick={() => alert("Profile picture upload coming soon!")}
              >
                Change
              </Button>
            )}
          </div>
          <CardTitle className="text-2xl font-semibold">
            {isEditing ? (
              <Input
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            ) : (
              profile.name
            )}
          </CardTitle>
          <Badge variant="secondary">{profile.role}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Email</Label>
            {isEditing ? (
              <Input
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            )}
          </div>
          <div>
            <Label>Phone</Label>
            {isEditing ? (
              <Input
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter phone"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
            )}
          </div>
          <div>
            <Label>Address</Label>
            {isEditing ? (
              <Textarea
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.address}</p>
            )}
          </div>
          <div>
            <Label>Bio</Label>
            {isEditing ? (
              <Textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Enter bio"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            )}
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <Button onClick={handleEditToggle}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
            <Button onClick={() =>handelResetPassword } variant="destructive">Reset Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default SuperAdminProfile;
