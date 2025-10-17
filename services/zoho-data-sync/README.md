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
2. ✅ **Phase 2**: API Connection Layer (with dry-run support)
3. ✅ **Phase 3**: Module Blueprints (22-26 fields per module)
4. ✅ **Phase 4**: Data Cleanup & Validation (dedup, normalization)
5. ✅ **Phase 5**: Import Handlers (tested with 2 Zoho records created)
6. ✅ **Phase 6**: Admin UI & Commands (/admin/data-sync)
7. ✅ **Phase 7**: Architect Review & Critical Fixes (dry-run isolation fixed)

**ALL PHASES COMPLETE - SERVICE READY FOR PRODUCTION**

## 🚀 Quick Start

### Access Admin UI
1. Navigate to: `http://localhost:5000/admin/data-sync`
2. Upload CSV/Excel file
3. Select module (Accounts/Contacts/Resources)
4. Run dry-run to preview
5. Execute live import

### Test Results
- ✅ 2 records successfully created in Zoho CRM
- ✅ Dry-run mode: NO API calls (verified)
- ✅ Tag isolation: DataSyncService applied
- ✅ Field mapping: 25+ fields per module

### API Endpoints
```
POST /api/data-sync/upload   - Upload file
POST /api/data-sync/import   - Execute import
GET  /api/data-sync/history  - View import history
```

### Programmatic Usage

```typescript
import { importHandler } from './services/zoho-data-sync/import/import-handler';

// Import with dry-run
const result = await importHandler.importFile({
  moduleName: 'Contacts',
  filePath: '/path/to/file.csv',
  dryRun: true  // Safe preview, no API calls
});

// Live import
const liveResult = await importHandler.importFile({
  moduleName: 'Accounts',
  filePath: '/path/to/institutions.xlsx',
  dryRun: false,
  batchSize: 100
});
```

## Configuration

Default configuration in `index.ts`:
- Source Tag: `"DataSyncService"`
- Batch Size: 100 records
- Safe Mode: Enabled (protects WebForm records)
- Logs: `services/zoho-data-sync/logs`
- Checkpoints: `services/zoho-data-sync/backups`
