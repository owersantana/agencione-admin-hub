
import React, { useState, useEffect } from 'react';
import { OneMapToolbar } from '../components/OneMapToolbar';
import { OneMapGrid } from '../components/OneMapGrid';
import { OneMapCanvas } from '../components/OneMapCanvas';
import { CreateMapModal } from '../components/CreateMapModal';
import { EditMapModal } from '../components/EditMapModal';
import { ShareMapModal } from '../components/ShareMapModal';
import { MindMap } from '../config';

const STORAGE_KEY = 'onemap-data';

function OneMap() {
  const [maps, setMaps] = useState<MindMap[]>([
    {
      id: '1',
      name: 'Projeto Empresa',
      description: 'Mapa mental para planejamento estratégico da empresa',
      nodes: [
        {
          id: 'root',
          text: 'Estratégia 2024',
          x: 400,
          y: 300,
          width: 160,
          height: 50,
          color: '#FFFFFF',
          backgroundColor: '#3B82F6',
          fontSize: 16,
          fontWeight: 'bold',
          isRoot: true,
          children: ['node-1', 'node-2'],
          isExpanded: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'node-1',
          text: 'Marketing',
          x: 200,
          y: 200,
          width: 120,
          height: 40,
          color: '#FFFFFF',
          backgroundColor: '#10B981',
          fontSize: 14,
          fontWeight: 'normal',
          isRoot: false,
          parentId: 'root',
          children: [],
          isExpanded: true,
          createdAt: '2024-01-15T10:05:00Z',
          updatedAt: '2024-01-15T10:05:00Z',
        },
        {
          id: 'node-2',
          text: 'Vendas',
          x: 600,
          y: 200,
          width: 120,
          height: 40,
          color: '#FFFFFF',
          backgroundColor: '#EF4444',
          fontSize: 14,
          fontWeight: 'normal',
          isRoot: false,
          parentId: 'root',
          children: [],
          isExpanded: true,
          createdAt: '2024-01-15T10:06:00Z',
          updatedAt: '2024-01-15T10:06:00Z',
        },
      ],
      connections: [
        {
          id: 'conn-1',
          fromNodeId: 'root',
          toNodeId: 'node-1',
          color: '#10B981',
          style: 'solid',
          thickness: 2,
        },
        {
          id: 'conn-2',
          fromNodeId: 'root',
          toNodeId: 'node-2',
          color: '#EF4444',
          style: 'solid',
          thickness: 2,
        },
      ],
      canvasWidth: 2000,
      canvasHeight: 1500,
      zoom: 1,
      centerX: 400,
      centerY: 300,
      isPublic: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'user1',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  const [activeMap, setActiveMap] = useState<MindMap | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<MindMap | null>(null);
  const [sharingMap, setSharingMap] = useState<MindMap | null>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.maps && Array.isArray(parsedData.maps)) {
          setMaps(parsedData.maps);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = (mapsData: MindMap[]) => {
    try {
      const dataToSave = {
        maps: mapsData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  };

  const handleMapAction = (mapId: string, action: string) => {
    const map = maps.find(m => m.id === mapId);
    if (!map) return;

    switch (action) {
      case 'view':
        setActiveMap(map);
        setViewMode('canvas');
        break;
      case 'edit':
        setEditingMap(map);
        setIsEditModalOpen(true);
        break;
      case 'share':
        setSharingMap(map);
        setIsShareModalOpen(true);
        break;
      case 'duplicate':
        const duplicatedMap: MindMap = {
          ...map,
          id: crypto.randomUUID(),
          name: `${map.name} (Cópia)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedMapsWithDuplicate = [...maps, duplicatedMap];
        setMaps(updatedMapsWithDuplicate);
        saveToStorage(updatedMapsWithDuplicate);
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja excluir este mapa mental?')) {
          const filteredMaps = maps.filter(m => m.id !== mapId);
          setMaps(filteredMaps);
          saveToStorage(filteredMaps);
          if (activeMap?.id === mapId) {
            setActiveMap(null);
            setViewMode('grid');
          }
        }
        break;
    }
  };

  const handleCreateMap = (mapData: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newMap: MindMap = {
      ...mapData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    const updatedMaps = [...maps, newMap];
    setMaps(updatedMaps);
    saveToStorage(updatedMaps);
    setIsCreateModalOpen(false);
  };

  const handleUpdateMap = (updatedMap: MindMap) => {
    const updatedMaps = maps.map(m => 
      m.id === updatedMap.id ? { ...updatedMap, updatedAt: new Date().toISOString() } : m
    );
    setMaps(updatedMaps);
    saveToStorage(updatedMaps);
    if (activeMap?.id === updatedMap.id) {
      setActiveMap(updatedMap);
    }
    setIsEditModalOpen(false);
    setEditingMap(null);
  };

  const handleBackToGrid = () => {
    setActiveMap(null);
    setViewMode('grid');
  };

  return (
    <div className="h-full flex flex-col">
      <OneMapToolbar
        onCreateMap={() => setIsCreateModalOpen(true)}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        activeMap={activeMap}
        onBackToGrid={handleBackToGrid}
      />

      {viewMode === 'grid' ? (
        <OneMapGrid maps={maps} onMapAction={handleMapAction} />
      ) : (
        <OneMapCanvas 
          map={activeMap} 
          onMapUpdate={handleUpdateMap}
          onMapAction={handleMapAction}
        />
      )}

      <CreateMapModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMap}
      />

      <EditMapModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMap(null);
        }}
        map={editingMap}
        onSubmit={handleUpdateMap}
      />

      <ShareMapModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingMap(null);
        }}
        map={sharingMap}
      />
    </div>
  );
}

export default OneMap;
