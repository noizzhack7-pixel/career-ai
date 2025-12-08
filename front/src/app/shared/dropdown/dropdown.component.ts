import { Component, Input, Output, EventEmitter, signal, HostListener, ElementRef, inject, OnDestroy } from '@angular/core';
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
export class DropdownComponent implements OnDestroy {
    private elementRef = inject(ElementRef);
    private static activeDropdown: DropdownComponent | null = null;

    @Input() options: DropdownOption[] = [];
    @Input() selectedValue: string = '';
    @Input() defaultValue: string = '';
    @Input() width: string = '100%';
    @Input() alwaysBold: boolean = false;
    @Input() noBG: boolean = false;
    @Output() selectionChange = new EventEmitter<string>();

    isOpen = signal(false);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
            this.close();
        }
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
        if (this.isOpen()) {
            this.close();
        }
    }

    toggleDropdown(event: MouseEvent): void {
        event.stopPropagation();
        const willOpen = !this.isOpen();

        // Close any other open dropdown
        if (willOpen && DropdownComponent.activeDropdown && DropdownComponent.activeDropdown !== this) {
            DropdownComponent.activeDropdown.close();
        }

        this.isOpen.set(willOpen);
        DropdownComponent.activeDropdown = this.isOpen() ? this : null;
    }

    selectOption(value: string): void {
        this.selectionChange.emit(value);
        this.close();
    }

    getSelectedLabel(): string {
        const option = this.options.find(o => o.value === this.selectedValue);
        return option?.label || '';
    }

    private close(): void {
        this.isOpen.set(false);
        if (DropdownComponent.activeDropdown === this) {
            DropdownComponent.activeDropdown = null;
        }
    }

    ngOnDestroy(): void {
        if (DropdownComponent.activeDropdown === this) {
            DropdownComponent.activeDropdown = null;
        }
    }
}

