import { Component, Input, Output, EventEmitter, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
    value: string;
    label: string;
    icon?: string;
}

@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
    private elementRef = inject(ElementRef);

    @Input() options: DropdownOption[] = [];
    @Input() selectedValue: string = '';
    @Input() defaultValue: string = '';
    @Input() width: string = '100%';
    @Input() alwaysBold: boolean = false;
    @Output() selectionChange = new EventEmitter<string>();

    isOpen = signal(false);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
        if (this.isOpen()) {
            this.isOpen.set(false);
        }
    }

    toggleDropdown(event: MouseEvent): void {
        event.stopPropagation();
        this.isOpen.update(v => !v);
    }

    selectOption(value: string): void {
        this.selectionChange.emit(value);
        this.isOpen.set(false);
    }

    getSelectedLabel(): string {
        const option = this.options.find(o => o.value === this.selectedValue);
        return option?.label || '';
    }
}

