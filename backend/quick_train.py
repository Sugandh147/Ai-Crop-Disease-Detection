import os
import json
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms, datasets
from torch.utils.data import DataLoader, Subset

def quick_train(data_dir, num_epochs=3, max_per_class=50, save_path="model.pth"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Starting Quick Training on device: {device}")

    if not os.path.exists(data_dir):
        print(f"Error: Dataset path '{data_dir}' not found.")
        return

    # Image Transforms
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    full_dataset = datasets.ImageFolder(root=data_dir, transform=transform)
    class_names = full_dataset.classes
    num_classes = len(class_names)

    # Save class names
    with open("class_names.json", "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"Saved {num_classes} classes to class_names.json")

    # Sample max_per_class images per class for super fast training
    class_indices = {i: [] for i in range(num_classes)}
    for idx, (_, label) in enumerate(full_dataset.samples):
        if len(class_indices[label]) < max_per_class:
            class_indices[label].append(idx)

    selected_indices = []
    for indices in class_indices.values():
        selected_indices.extend(indices)

    random.shuffle(selected_indices)
    print(f"Selected {len(selected_indices)} total images ({max_per_class} per class) for fast training.")

    sub_dataset = Subset(full_dataset, selected_indices)
    loader = DataLoader(sub_dataset, batch_size=32, shuffle=True)

    # Load MobileNetV2 with pre-trained weights
    try:
        from torchvision.models import MobileNet_V2_Weights
        model = models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
    except (ImportError, AttributeError):
        model = models.mobilenet_v2(pretrained=True)

    # Freeze feature extractor
    for param in model.parameters():
        param.requires_grad = False

    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.002)

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        running_corrects = 0
        total_samples = 0

        for inputs, labels in loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()
            total_samples += inputs.size(0)

        epoch_loss = running_loss / total_samples
        epoch_acc = running_corrects / total_samples
        print(f"Epoch {epoch+1}/{num_epochs} - Loss: {epoch_loss:.4f} - Accuracy: {epoch_acc:.4f}")

    torch.save(model.state_dict(), save_path)
    print(f"\nFAST TRAINING COMPLETE! Saved trained model weights to '{save_path}'!")

if __name__ == "__main__":
    dataset_path = r"C:\Users\ACER\Downloads\plantvillage dataset\color"
    quick_train(dataset_path, num_epochs=3, max_per_class=50)
