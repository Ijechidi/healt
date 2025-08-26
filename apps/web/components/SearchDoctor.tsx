'use client';

import React from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/select';
import { specialities } from './spacialites/mock';
import { useSearchStore } from './hooks/useSearchStore';

export default function SearchDoctor() {
  const { location, nom, speciality, setLocation, setNom, setSpeciality, reset } = useSearchStore();

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center flex-wrap bg-background rounded-md p-2 shadow-lg">
        <div className="flex">
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex">
          <Input
            type="text"
            placeholder="Nom de l'hôpital"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex-1 min-w-[120px]">
          <Select value={speciality} onValueChange={setSpeciality}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Specialites" />
            </SelectTrigger>
            <SelectContent>
              {specialities.map((speciality) => (
                <SelectItem key={speciality.id} value={speciality.id|| "1"}>
                  {speciality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button size="lg" variant="outline" className="self-start" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
