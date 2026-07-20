import os
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Dataset, random_split

class DatasetSplitWrapper(Dataset):
    def __init__(self, subset, transform=None):
        self.subset = subset
        self.transform = transform
        
    def __getitem__(self, index):
        x, y = self.subset[index]
        if self.transform:
            # apply transform to the PIL image
            x = self.transform(x)
        return x, y
        
    def __len__(self):
        return len(self.subset)

def get_dataloaders(data_dir, batch_size=32, train_split=0.8):
    # Data augmentation and normalization for training
    # Just normalization for validation
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    print(f"Loading dataset from {data_dir}...")
    full_dataset = datasets.ImageFolder(data_dir)
    class_names = full_dataset.classes
    print(f"Found {len(class_names)} classes.")

    train_size = int(train_split * len(full_dataset))
    val_size = len(full_dataset) - train_size
    
    train_subset, val_subset = random_split(full_dataset, [train_size, val_size])
    
    train_dataset = DatasetSplitWrapper(train_subset, transform=data_transforms['train'])
    val_dataset = DatasetSplitWrapper(val_subset, transform=data_transforms['val'])

    # num_workers=0 is safer on Windows to avoid multiprocessing issues
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    
    return train_loader, val_loader, class_names

if __name__ == "__main__":
    # Test dataloader
    t, v, c = get_dataloaders(r"C:\Users\ACER\Downloads\plantvillage dataset\color", batch_size=4)
    print("Classes:", c)
    print(f"Train size: {len(t.dataset)}, Val size: {len(v.dataset)}")
