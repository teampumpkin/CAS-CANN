# Zoho Data Sync Service

Standalone data integration service for the Canadian Amyloidosis Society Zoho CRM.

## Purpose

This service handles bulk data operations (import, cleanup, transformation) independently from the live web form → Zoho CRM integration pipeline.

## Architecture

### Modules
- **Accounts** → Directory Institutions (hospitals, clinics, centers)
- **Contacts** → CAS/CANN Membership (healthcare professionals)
- **Resources** → Documents, forms, guides (linked to Institutions)

### Safety Features
- **Tag-based isolation**: Only operates on records tagged with `"DataSyncService"`
- **WebForm protection**: Never touches records tagged with `"WebForm"`
- **Checkpoint system**: Each phase saves state before proceeding
- **Comprehensive logging**: All operations tracked in `/logs`

### Key Components

1. **Data Parser** (`/utils/data-parser.ts`)
   - CSV/Excel file parsing
   - Column detection and mapping
   - Data type inference

2. **Data Cleaner** (`/cleanup/data-cleaner.ts`)
   - Deduplication (by Institution_ID, Email)
   - Field normalization (names, addresses, phones)
   - Validation and error reporting

3. **Module Schemas** (`/modules/`)
   - accounts-schema.ts → Institution field definitions
   - contacts-schema.ts → Member field definitions
   - resources-schema.ts → Resource field definitions

4. **Import Handlers** (`/uploads/`)
   - Batch processing with Zoho Bulk API
   - Relationship linking (Contacts → Accounts, Resources → Accounts)
   - Upsert logic using unique identifiers

## Checkpoint Methodology

Each phase must complete successfully before proceeding:

1. ✅ **Phase 1**: Environment Setup
2. ⏳ **Phase 2**: API Connection Layer
3. ⏳ **Phase 3**: Module Blueprints
4. ⏳ **Phase 4**: Data Cleanup & Validation
5. ⏳ **Phase 5**: Import Handlers
6. ⏳ **Phase 6**: Admin UI & Commands
7. ⏳ **Phase 7**: Integrity Validation
8. ⏳ **Phase 8**: Final Testing

## Usage

```typescript
import { dataSyncService } from './services/zoho-data-sync';

// Test connection
await dataSyncService.testConnection();

// Get service status
const status = dataSyncService.getStatus();

// Save checkpoint
await dataSyncService.saveCheckpoint('phase1', 'success', { 
  message: 'Environment setup complete' 
});
```

## Configuration

Default configuration in `index.ts`:
- Source Tag: `"DataSyncService"`
- Batch Size: 100 records
- Safe Mode: Enabled (protects WebForm records)
- Logs: `services/zoho-data-sync/logs`
- Checkpoints: `services/zoho-data-sync/backups`
