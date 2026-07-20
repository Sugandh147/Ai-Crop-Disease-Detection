import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
from dataset import get_dataloaders
import os
import json

def train_model(data_dir, num_epochs=5, batch_size=32, save_path="model.pth"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 1. Load Data
    train_loader, val_loader, class_names = get_dataloaders(data_dir, batch_size=batch_size)
    num_classes = len(class_names)
    
    # Save class names for inference
    with open("class_names.json", "w") as f:
        json.dump(class_names, f)

    # 2. Setup Model (MobileNetV2 is fast and lightweight)
    model = models.mobilenet_v2(pretrained=True)
    # Freeze early layers
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace the classifier
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    model = model.to(device)

    # 3. Loss and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)

    # 4. Training Loop
    best_acc = 0.0
    
    for epoch in range(num_epochs):
        print(f"Epoch {epoch+1}/{num_epochs}")
        print("-" * 10)
        
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
                dataloader = train_loader
            else:
                model.eval()
                dataloader = val_loader

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloader.dataset)
            epoch_acc = running_corrects.double() / len(dataloader.dataset)

            print(f"{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

            # Save the model if it's the best one
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                torch.save(model.state_dict(), save_path)
                print("Model saved!")
        print()

    print(f"Training complete. Best val Acc: {best_acc:.4f}")
    return model

if __name__ == "__main__":
    dataset_path = r"C:\Users\ACER\Downloads\plantvillage dataset\color"
    train_model(dataset_path, num_epochs=5, batch_size=32)
