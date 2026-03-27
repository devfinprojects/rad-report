/**
 * Template Data Module - Radiology Report Templates
 * Part of RadReport AI Data Layer
 * Contains 500+ complete template objects
 */

/**
 * Generates template data for all modalities and body regions
 * @returns {Array} Array of template objects
 */
export function getTemplateData() {
  return [
    // ============ CT HEAD TEMPLATES ============
    {
      id: 'tpl_ct_head_001',
      modality: 'CT',
      system: 'NEURO',
      name: 'CT Head Without Contrast - Standard',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
Axial CT images of the head were obtained without intravenous contrast.

FINDINGS:
___Parenchyma: ___
___Ventricular System: ___
___Gray-White Matter Differentiation: ___
___Midline Structures: ___
___Basal Cisterns: ___
___Bone Windows: ___
___Orbits: ___
___Sinuses: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal CT head without evidence of acute intracranial hemorrhage, mass effect, or territorial infarction. Ventricles and sulci are appropriate for age. No calvarial fractures identified.',
      normalReport: `TECHNIQUE:
Axial CT images of the head were obtained without intravenous contrast.

FINDINGS:
Parenchyma: Gray-white matter differentiation is preserved. No focal areas of abnormal attenuation are identified. No mass effect or midline shift.

Ventricular System: Ventricles are appropriate in size and configuration for age. No evidence of hydrocephalus or ventricular dilatation.

Gray-White Matter Differentiation: Normal gray-white matter differentiation is maintained throughout.

Midline Structures: Midline structures are centered. No midline shift or herniation.

Basal Cisterns: Basal cisterns are patent. No effacement or compression.

Bone Windows: No calvarial fractures identified. Skull base is intact.

Orbits: Orbits are unremarkable. No orbital fractures or abnormal soft tissue densities.

Sinuses: Paranasal sinuses are well aerated. No sinusitis or fluid levels.

IMPRESSION:
1. Normal CT head examination.
2. No acute intracranial abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Frontal Lobe', checked: false },
        { id: 'c2', name: 'Parietal Lobe', checked: false },
        { id: 'c3', name: 'Temporal Lobe', checked: false },
        { id: 'c4', name: 'Occipital Lobe', checked: false },
        { id: 'c5', name: 'Cerebellum', checked: false },
        { id: 'c6', name: 'Brainstem', checked: false },
        { id: 'c7', name: 'Lateral Ventricles', checked: false },
        { id: 'c8', name: 'Third Ventricle', checked: false },
        { id: 'c9', name: 'Fourth Ventricle', checked: false },
        { id: 'c10', name: 'Basal Cisterns', checked: false }
      ],
      tags: ['CT', 'HEAD', 'WITHOUT CONTRAST', 'NEURO', 'ROUTINE'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_ct_head_002',
      modality: 'CT',
      system: 'NEURO',
      name: 'CT Head With and Without Contrast',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
Axial CT images of the head were obtained with and without intravenous contrast.

FINDINGS:
___Pre-Contrast: ___
___Post-Contrast: ___
___Parenchyma: ___
___Ventricular System: ___
___Vascular: ___
___Bone Windows: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal CT head with and without contrast. No enhancing lesions, masses, or vascular abnormalities identified.',
      normalReport: `TECHNIQUE:
Axial CT images of the head were obtained with and without intravenous contrast.

FINDINGS:
Pre-Contrast: No hyperdense lesions or abnormal attenuations identified.

Post-Contrast: No abnormal enhancement pattern. No enhancing masses or vascular lesions.

Parenchyma: Gray-white matter differentiation is preserved. No focal lesions or mass effect.

Ventricular System: Ventricles are normal in size. No hydrocephalus.

Vascular: Normal vascular enhancement pattern. No aneurysms or vascular malformations.

Bone Windows: No fractures or bony abnormalities.

IMPRESSION:
1. Normal CT head with and without contrast.
2. No enhancing lesions or vascular abnormalities.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Frontal Lobe', checked: false },
        { id: 'c2', name: 'Temporal Lobe', checked: false },
        { id: 'c3', name: 'Parietal Lobe', checked: false },
        { id: 'c4', name: 'Occipital Lobe', checked: false },
        { id: 'c5', name: 'Cerebellum', checked: false },
        { id: 'c6', name: 'Brainstem', checked: false }
      ],
      tags: ['CT', 'HEAD', 'WITH CONTRAST', 'NEURO'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ CT CHEST TEMPLATES ============
    {
      id: 'tpl_ct_chest_001',
      modality: 'CT',
      system: 'PULMONARY',
      name: 'CT Chest With IV Contrast - Standard',
      bodyRegion: 'CHEST',
      templateText: `TECHNIQUE:
Helical CT of the chest with axial, coronal, and sagittal reconstructions was performed following intravenous administration of contrast.

FINDINGS:
___Lungs: ___
___Airway: ___
___Mediastinum: ___
___Hila: ___
___Heart: ___
___Pleura: ___
___Chest Wall: ___
___Upper Abdomen: ___
___Bones: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal CT chest. No focal pulmonary consolidations, effusions, or lymphadenopathy. Heart size is normal. No acute bony abnormalities.',
      normalReport: `TECHNIQUE:
Helical CT of the chest with axial, coronal, and sagittal reconstructions was performed following intravenous administration of contrast.

FINDINGS:
Lungs: Lungs are clear bilaterally. No focal consolidations, nodules, or masses. No interstitial opacities. Bronchi are patent. No pleural effusions or pneumothoraces.

Airway: Trachea and main bronchi are patent. No endobronchial lesions or obstructions.

Mediastinum: Mediastinal and hilar contours are normal. No lymphadenopathy. No masses or abnormal soft tissue densities.

Hila: Pulmonary arteries are patent. No filling defects. Hilar vessels are normal in caliber.

Heart: Heart is normal in size. No pericardial effusion.

Pleura: Pleural surfaces are smooth. No pleural effusions or thickening.

Chest Wall: Soft tissues of the chest wall are unremarkable. No masses or abnormalities.

Upper Abdomen: Liver, spleen, and kidneys appear normal. No abnormalities identified.

Bones: No acute fractures or destructive lesions involving the thoracic vertebrae, ribs, or sternum.

IMPRESSION:
1. Normal CT chest examination.
2. No acute cardiopulmonary abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Upper Lobe', checked: false },
        { id: 'c2', name: 'Right Middle Lobe', checked: false },
        { id: 'c3', name: 'Right Lower Lobe', checked: false },
        { id: 'c4', name: 'Left Upper Lobe', checked: false },
        { id: 'c5', name: 'Left Lower Lobe', checked: false },
        { id: 'c6', name: 'Trachea', checked: false },
        { id: 'c7', name: 'Main Bronchi', checked: false },
        { id: 'c8', name: 'Mediastinum', checked: false },
        { id: 'c9', name: 'Heart', checked: false },
        { id: 'c10', name: 'Pleura', checked: false }
      ],
      tags: ['CT', 'CHEST', 'WITH IV CONTRAST', 'PULMONARY'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_ct_chest_002',
      modality: 'CT',
      system: 'PULMONARY',
      name: 'CT Chest Without Contrast - Screening',
      bodyRegion: 'CHEST',
      templateText: `TECHNIQUE:
Low-dose helical CT of the chest was performed without intravenous contrast.

FINDINGS:
___Lungs: ___
___Mediastinum: ___
___Heart: ___
___Pleura: ___
___Chest Wall: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'No suspicious pulmonary nodules or masses. Lungs are clear. No lymphadenopathy or pleural effusions.',
      normalReport: `TECHNIQUE:
Low-dose helical CT of the chest was performed without intravenous contrast.

FINDINGS:
Lungs: Lungs are clear bilaterally. No nodules, masses, or consolidation. No interstitial abnormalities. No pneumothorax.

Mediastinum: Mediastinal contours are normal. No lymphadenopathy or masses.

Heart: Heart is normal in size. No cardiomegaly or pericardial effusion.

Pleura: No pleural effusions or thickening.

Chest Wall: Soft tissues are unremarkable.

IMPRESSION:
1. Normal low-dose CT chest.
2. No pulmonary nodules or masses identified.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Lung', checked: false },
        { id: 'c2', name: 'Left Lung', checked: false },
        { id: 'c3', name: 'Mediastinum', checked: false },
        { id: 'c4', name: 'Heart', checked: false }
      ],
      tags: ['CT', 'CHEST', 'WITHOUT CONTRAST', 'SCREENING', 'LOW DOSE'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ CT ABDOMEN TEMPLATES ============
    {
      id: 'tpl_ct_abdomen_001',
      modality: 'CT',
      system: 'GI',
      name: 'CT Abdomen and Pelvis With IV Contrast',
      bodyRegion: 'ABDOMEN',
      templateText: `TECHNIQUE:
Helical CT of the abdomen and pelvis with oral and intravenous contrast was performed. Axial, coronal, and sagittal reconstructions were generated.

FINDINGS:
___Liver: ___
___Gallbladder: ___
___Biliary: ___
___Pancreas: ___
___Spleen: ___
___Kidneys: ___
___Adrenal Glands: ___
___Bowel: ___
___Peritoneum: ___
___Retroperitoneum: ___
___Pelvis: ___
___Vessels: ___
___Bones: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal CT abdomen and pelvis. All organs are normal in appearance. No masses, stones, or obstructive findings. No free fluid or lymphadenopathy.',
      normalReport: `TECHNIQUE:
Helical CT of the abdomen and pelvis with oral and intravenous contrast was performed. Axial, coronal, and sagittal reconstructions were generated.

FINDINGS:
Liver: Liver is normal in size and attenuation. No focal lesions, masses, or biliary ductal dilatation.

Gallbladder: Gallbladder is normal in appearance. No stones, wall thickening, or pericholecystic fluid.

Biliary: Intrahepatic and extrahepatic bile ducts are not dilated.

Pancreas: Pancreas is normal in size and contour. No masses, calcifications, or ductal dilatation.

Spleen: Spleen is normal in size. No masses or infarctions.

Kidneys: Both kidneys are normal in size and contour. No stones, masses, or hydronephrosis. Corticomedullary differentiation is preserved.

Adrenal Glands: Both adrenal glands are normal in size and morphology. No masses or thickening.

Bowel: Small and large bowel loops are normal in caliber with wall thickening. No bowel obstruction, perforation, or masses.

Peritoneum: No free fluid or free air.

Retroperitoneum: No lymphadenopathy or masses.

Pelvis: Bladder is adequately distended. No masses or wall thickening. No pelvic lymphadenopathy.

Vessels: Aorta and IVC are normal in caliber. No aneurysms or dissection.

Bones: No aggressive bony lesions or acute fractures.

IMPRESSION:
1. Normal CT examination of abdomen and pelvis.
2. No acute intra-abdominal or pelvic abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Liver', checked: false },
        { id: 'c2', name: 'Gallbladder', checked: false },
        { id: 'c3', name: 'Pancreas', checked: false },
        { id: 'c4', name: 'Spleen', checked: false },
        { id: 'c5', name: 'Right Kidney', checked: false },
        { id: 'c6', name: 'Left Kidney', checked: false },
        { id: 'c7', name: 'Adrenal Glands', checked: false },
        { id: 'c8', name: 'Small Bowel', checked: false },
        { id: 'c9', name: 'Large Bowel', checked: false },
        { id: 'c10', name: 'Bladder', checked: false }
      ],
      tags: ['CT', 'ABDOMEN', 'PELVIS', 'WITH IV CONTRAST', 'GI', 'GU'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_ct_abdomen_002',
      modality: 'CT',
      system: 'GI',
      name: 'CT Abdomen Without Contrast - Stone Protocol',
      bodyRegion: 'ABDOMEN',
      templateText: `TECHNIQUE:
Helical CT of the abdomen and pelvis was performed without oral or intravenous contrast.

FINDINGS:
___Kidneys: ___
___Ureters: ___
___Bladder: ___
___Liver: ___
___Spleen: ___
___Pancreas: ___
___Aorta: ___
___Bowel: ___
___Soft Tissues: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'No renal or ureteral calculi identified. No hydronephrosis or ureteral dilatation. All solid organs are unremarkable.',
      normalReport: `TECHNIQUE:
Helical CT of the abdomen and pelvis was performed without oral or intravenous contrast.

FINDINGS:
Kidneys: Both kidneys are normal in size and contour. No renal calculi. No hydronephrosis. Corticomedullary differentiation is normal.

Ureters: Both ureters are not dilated. No ureteral calculi identified.

Bladder: Bladder is adequately distended. No stones or wall thickening.

Liver: Liver is normal in attenuation. No masses or lesions.

Spleen: Spleen is normal in size and attenuation.

Pancreas: Pancreas is normal in contour. No calcifications or masses.

Aorta: Aorta is normal in caliber. No aneurysm or dissection.

Bowel: Bowel is normal in caliber. No bowel obstruction or perforation.

Soft Tissues: No abnormal soft tissue masses or collections.

IMPRESSION:
1. Normal CT abdomen and pelvis without contrast.
2. No renal or ureteral calculi.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Kidney', checked: false },
        { id: 'c2', name: 'Left Kidney', checked: false },
        { id: 'c3', name: 'Ureters', checked: false },
        { id: 'c4', name: 'Bladder', checked: false }
      ],
      tags: ['CT', 'ABDOMEN', 'WITHOUT CONTRAST', 'STONE PROTOCOL', 'GU'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ MRI HEAD TEMPLATES ============
    {
      id: 'tpl_mri_head_001',
      modality: 'MRI',
      system: 'NEURO',
      name: 'MRI Brain Without Contrast',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
MRI of the brain was performed without intravenous contrast. Sequences include T1-weighted, T2-weighted, FLAIR, diffusion-weighted, and susceptibility-weighted imaging.

FINDINGS:
___Parenchyma: ___
___Ventricles: ___
___Midline: ___
___Posterior Fossa: ___
___Vessels: ___
___Orbits: ___
___Sinuses: ___
___Skull: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal MRI brain. No masses, hemorrhage, or infarctions. Ventricles are normal in size. No demyelinating disease.',
      normalReport: `TECHNIQUE:
MRI of the brain was performed without intravenous contrast. Sequences include T1-weighted, T2-weighted, FLAIR, diffusion-weighted, and susceptibility-weighted imaging.

FINDINGS:
Parenchyma: Gray-white matter differentiation is normal. No focal T1 or T2 signal abnormalities. No mass effect or midline shift. No areas of restricted diffusion.

Ventricles: Lateral ventricles are normal in size and configuration. Third and fourth ventricles are normal. No hydrocephalus.

Midline: Midline structures are unremarkable. No shift or herniation.

Posterior Fossa: Cerebellum and brainstem are normal in signal and morphology. No masses or infarctions. Fourth ventricle is normal.

Vessels: Flow voids are present. No aneurysms or vascular malformations on SWI.

Orbits: Orbital contents are unremarkable. No abnormal signal or masses.

Sinuses: Paranasal sinuses are well aerated. No mucosal thickening or fluid levels.

Skull: No calvarial lesions or abnormalities.

IMPRESSION:
1. Normal MRI brain examination.
2. No intracranial abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Frontal Lobe', checked: false },
        { id: 'c2', name: 'Temporal Lobe', checked: false },
        { id: 'c3', name: 'Parietal Lobe', checked: false },
        { id: 'c4', name: 'Occipital Lobe', checked: false },
        { id: 'c5', name: 'Cerebellum', checked: false },
        { id: 'c6', name: 'Brainstem', checked: false },
        { id: 'c7', name: 'Lateral Ventricles', checked: false },
        { id: 'c8', name: 'Third Ventricle', checked: false }
      ],
      tags: ['MRI', 'HEAD', 'WITHOUT CONTRAST', 'NEURO', 'BRAIN'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_mri_head_002',
      modality: 'MRI',
      system: 'NEURO',
      name: 'MRI Brain With and Without Contrast',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
MRI of the brain was performed with and without intravenous contrast. Sequences include T1-weighted, T2-weighted, FLAIR, diffusion-weighted, susceptibility-weighted, and post-contrast T1-weighted imaging.

FINDINGS:
___Pre-Contrast: ___
___Post-Contrast: ___
___Parenchyma: ___
___Ventricles: ___
___Vessels: ___
___Other: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal MRI brain with and without contrast. No enhancing lesions, masses, or vascular abnormalities.',
      normalReport: `TECHNIQUE:
MRI of the brain was performed with and without intravenous contrast. Sequences include T1-weighted, T2-weighted, FLAIR, diffusion-weighted, susceptibility-weighted, and post-contrast T1-weighted imaging.

FINDINGS:
Pre-Contrast: No abnormal T1 or T2 signal abnormalities. No mass effect or midline shift.

Post-Contrast: No abnormal parenchymal or leptomeningeal enhancement. No enhancing masses or lesions.

Parenchyma: Gray-white matter differentiation is normal. No focal lesions.

Ventricles: Ventricles are normal in size and configuration.

Vessels: No aneurysms or vascular malformations.

Other: Orbits, sinuses, and skull are unremarkable.

IMPRESSION:
1. Normal MRI brain with and without contrast.
2. No enhancing lesions identified.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Brain Parenchyma', checked: false },
        { id: 'c2', name: 'Ventricles', checked: false },
        { id: 'c3', name: 'Vascular Structures', checked: false }
      ],
      tags: ['MRI', 'HEAD', 'WITH CONTRAST', 'NEURO', 'BRAIN'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ MRI SPINE TEMPLATES ============
    {
      id: 'tpl_mri_spine_001',
      modality: 'MRI',
      system: 'NEURO',
      name: 'MRI Cervical Spine Without Contrast',
      bodyRegion: 'SPINE',
      templateText: `TECHNIQUE:
MRI of the cervical spine was performed without intravenous contrast.

FINDINGS:
___Cervical Vertebrae: ___
___Spinal Cord: ___
___Disc Levels: ___
___Foramina: ___
___Soft Tissues: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal MRI cervical spine. Vertebral body heights are maintained. No disc protrusions or canal stenosis. Spinal cord is normal in signal.',
      normalReport: `TECHNIQUE:
MRI of the cervical spine was performed without intravenous contrast.

FINDINGS:
Cervical Vertebrae: Vertebral bodies are normal in height and alignment. No fractures or bone marrow lesions. Endplates are intact.

Spinal Cord: Spinal cord demonstrates normal signal intensity. No cord edema, hemorrhage, or masses. No cord compression or syrinx.

Disc Levels: Intervertebral discs demonstrate normal hydration and height. No disc protrusions, extrusions, or bulges. No central canal stenosis.

Foramina: Neural foramina are patent bilaterally. No nerve root compression.

Soft Tissues: Prevertebral and paravertebral soft tissues are unremarkable. No masses or abnormal signal.

IMPRESSION:
1. Normal MRI cervical spine.
2. No cord abnormality, stenosis, or disc herniation.`,
      anatomyChecklist: [
        { id: 'c1', name: 'C2 Vertebra', checked: false },
        { id: 'c2', name: 'C3 Vertebra', checked: false },
        { id: 'c3', name: 'C4 Vertebra', checked: false },
        { id: 'c4', name: 'C5 Vertebra', checked: false },
        { id: 'c5', name: 'C6 Vertebra', checked: false },
        { id: 'c6', name: 'C7 Vertebra', checked: false },
        { id: 'c7', name: 'Spinal Cord', checked: false },
        { id: 'c8', name: 'Nerve Roots', checked: false }
      ],
      tags: ['MRI', 'SPINE', 'CERVICAL', 'WITHOUT CONTRAST', 'NEURO'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_mri_spine_002',
      modality: 'MRI',
      system: 'NEURO',
      name: 'MRI Lumbar Spine Without Contrast',
      bodyRegion: 'SPINE',
      templateText: `TECHNIQUE:
MRI of the lumbar spine was performed without intravenous contrast.

FINDINGS:
___Lumbar Vertebrae: ___
___Spinal Canal: ___
___Conus Medullaris: ___
___Disc Levels: ___
___Foramina: ___
___Soft Tissues: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal MRI lumbar spine. Vertebral alignment is normal. No disc protrusions or canal stenosis. Conus medullaris is normal in position.',
      normalReport: `TECHNIQUE:
MRI of the lumbar spine was performed without intravenous contrast.

FINDINGS:
Lumbar Vertebrae: Vertebral bodies demonstrate normal height and alignment. No fractures or bone marrow abnormalities. Endplates are intact.

Spinal Canal: Spinal canal is normal in caliber. No stenosis or masses.

Conus Medullaris: Conus medullaris terminates at the L1-L2 level, which is normal. No cord edema or masses.

Disc Levels: Intervertebral discs demonstrate normal signal and height. No disc protrusions, extrusions, or significant bulges at any level.

Foramina: Neural foramina are patent bilaterally. No nerve root impingement.

Soft Tissues: Paraspinal soft tissues are unremarkable.

IMPRESSION:
1. Normal MRI lumbar spine.
2. No disc herniation or canal stenosis.`,
      anatomyChecklist: [
        { id: 'c1', name: 'L1 Vertebra', checked: false },
        { id: 'c2', name: 'L2 Vertebra', checked: false },
        { id: 'c3', name: 'L3 Vertebra', checked: false },
        { id: 'c4', name: 'L4 Vertebra', checked: false },
        { id: 'c5', name: 'L5 Vertebra', checked: false },
        { id: 'c6', name: 'Sacrum', checked: false },
        { id: 'c7', name: 'Conus Medullaris', checked: false },
        { id: 'c8', name: 'Cauda Equina', checked: false }
      ],
      tags: ['MRI', 'SPINE', 'LUMBAR', 'WITHOUT CONTRAST', 'NEURO'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ X-RAY TEMPLATES ============
    {
      id: 'tpl_xray_chest_001',
      modality: 'X-RAY',
      system: 'PULMONARY',
      name: 'Chest X-Ray PA and Lateral',
      bodyRegion: 'CHEST',
      templateText: `TECHNIQUE:
PA and lateral views of the chest were obtained.

FINDINGS:
___Lungs: ___
___Pleura: ___
___Heart: ___
___Mediastinum: ___
___Hila: ___
___Bones: ___
___Soft Tissues: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal chest radiograph. Lungs are clear. Heart size is normal. No pleural effusions or pneumothoraces. No acute bone fractures.',
      normalReport: `TECHNIQUE:
PA and lateral views of the chest were obtained.

FINDINGS:
Lungs: Lungs are clear bilaterally. No focal consolidations, effusions, or pneumothoraces. No interstitial markings to suggest pulmonary edema.

Pleura: Pleural surfaces are sharp. No pleural effusions or thickening.

Heart: Heart size is normal. Cardiomediastinal silhouette is within normal limits.

Mediastinum: Mediastinal and hilar contours are normal. No lymphadenopathy or masses.

Hila: Hilar structures are normal in size and configuration. No masses or lymphadenopathy.

Bones: Thoracic vertebrae and ribs are intact. No acute fractures or destructive lesions.

Soft Tissues: Soft tissues of the chest wall are unremarkable.

IMPRESSION:
1. Normal chest x-ray.
2. No acute cardiopulmonary abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Lung', checked: false },
        { id: 'c2', name: 'Left Lung', checked: false },
        { id: 'c3', name: 'Heart', checked: false },
        { id: 'c4', name: 'Mediastinum', checked: false },
        { id: 'c5', name: 'Hila', checked: false }
      ],
      tags: ['X-RAY', 'CHEST', 'PA', 'LATERAL', 'PULMONARY'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_xray_chest_002',
      modality: 'X-RAY',
      system: 'PULMONARY',
      name: 'Chest X-Ray AP Portable',
      bodyRegion: 'CHEST',
      templateText: `TECHNIQUE:
AP portable view of the chest was obtained.

FINDINGS:
___Lungs: ___
___Heart: ___
___Pleura: ___
___Mediastinum: ___
___Bones: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal AP chest radiograph. Lungs are clear. Heart size is borderline normal for portable technique. No acute findings.',
      normalReport: `TECHNIQUE:
AP portable view of the chest was obtained.

FINDINGS:
Lungs: Lungs are clear bilaterally. No focal consolidations, effusions, or pneumothoraces.

Heart: Heart size is at upper limits of normal for AP technique. No cardiomegaly.

Pleura: No pleural effusions or pneumothoraces.

Mediastinum: Mediastinal contours are normal.

Bones: No acute fractures of the ribs or thoracic vertebrae.

IMPRESSION:
1. Normal AP chest x-ray.
2. No acute cardiopulmonary abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Lung', checked: false },
        { id: 'c2', name: 'Left Lung', checked: false },
        { id: 'c3', name: 'Heart', checked: false }
      ],
      tags: ['X-RAY', 'CHEST', 'AP', 'PORTABLE', 'PULMONARY'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ ULTRASOUND TEMPLATES ============
    {
      id: 'tpl_us_abdo_001',
      modality: 'ULTRASOUND',
      system: 'GI',
      name: 'Complete Abdomen Ultrasound',
      bodyRegion: 'ABDOMEN',
      templateText: `TECHNIQUE:
Gray scale and color Doppler ultrasound of the abdomen was performed.

FINDINGS:
___Liver: ___
___Gallbladder: ___
___Biliary: ___
___Pancreas: ___
___Spleen: ___
___Kidneys: ___
___Aorta: ___
___IVC: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal abdominal ultrasound. All solid organs are normal in size and echotexture. No masses, stones, or dilatation.',
      normalReport: `TECHNIQUE:
Gray scale and color Doppler ultrasound of the abdomen was performed.

FINDINGS:
Liver: Liver is normal in size and echotexture. No focal lesions, masses, or biliary ductal dilatation. Hepatic veins are patent.

Gallbladder: Gallbladder is normal in size and wall thickness. No stones, sludge, or pericholecystic fluid. Gallbladder empties well.

Biliary: Intrahepatic bile ducts are not dilated. Common bile duct measures normal in caliber (<6mm).

Pancreas: Pancreas is normal in size and echotexture. No masses or pancreatic duct dilatation.

Spleen: Spleen is normal in size and echotexture. No focal lesions or masses.

Kidneys: Both kidneys are normal in size and corticomedullary differentiation. No hydronephrosis, stones, or masses.

Aorta: Aorta is normal in caliber. No aneurysm or dissection.

IVC: Inferior vena cava is normal in caliber and compressible.

IMPRESSION:
1. Normal abdominal ultrasound.
2. No hepatic, biliary, renal, or pancreatic abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Liver', checked: false },
        { id: 'c2', name: 'Gallbladder', checked: false },
        { id: 'c3', name: 'Pancreas', checked: false },
        { id: 'c4', name: 'Spleen', checked: false },
        { id: 'c5', name: 'Right Kidney', checked: false },
        { id: 'c6', name: 'Left Kidney', checked: false }
      ],
      tags: ['ULTRASOUND', 'ABDOMEN', 'GI', 'DOPPLER'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_us_pelvis_001',
      modality: 'ULTRASOUND',
      system: 'GU',
      name: 'Pelvic Ultrasound - Female',
      bodyRegion: 'PELVIS',
      templateText: `TECHNIQUE:
Transabdominal and transvaginal pelvic ultrasound was performed.

FINDINGS:
___Uterus: ___
___Endometrium: ___
___Ovaries: ___
___Adnexa: ___
___Bladder: ___
___Free Fluid: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal pelvic ultrasound. Uterus is normal in size and configuration. Ovaries are normal in size. No free fluid.',
      normalReport: `TECHNIQUE:
Transabdominal and transvaginal pelvic ultrasound was performed.

FINDINGS:
Uterus: Uterus is normal in size and anteverted position. Myometrium is normal in echotexture. No fibroids or masses.

Endometrium: Endometrium is thin and echogenic, consistent with reproductive age. No polyps or thickening.

Ovaries: Both ovaries are normal in size and echotexture. No cysts, masses, or abnormal flow.

Adnexa: No adnexal masses or tenderness. No tubal abnormalities.

Bladder: Bladder is adequately distended. Wall is thin. No stones or masses.

Free Fluid: No free fluid in the pelvis.

IMPRESSION:
1. Normal pelvic ultrasound.
2. No uterine, ovarian, or adnexal abnormality.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Uterus', checked: false },
        { id: 'c2', name: 'Endometrium', checked: false },
        { id: 'c3', name: 'Right Ovary', checked: false },
        { id: 'c4', name: 'Left Ovary', checked: false },
        { id: 'c5', name: 'Bladder', checked: false }
      ],
      tags: ['ULTRASOUND', 'PELVIS', 'FEMALE', 'GYNECOLOGIC'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ MAMMOGRAPHY TEMPLATES ============
    {
      id: 'tpl_mammo_001',
      modality: 'MAMMOGRAPHY',
      system: 'BREAST',
      name: 'Diagnostic Mammogram - CC and MLO',
      bodyRegion: 'BREAST',
      templateText: `TECHNIQUE:
Diagnostic mammography was performed with craniocaudal and mediolateral oblique views. Additional spot compression and magnification views as indicated.

FINDINGS:
___Right Breast: ___
___Left Breast: ___
___Skin: ___
___Nipples: ___
___Axillae: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'BI-RADS 1: Negative. No malignant calcifications, masses, or architectural distortion. Breast tissue is heterogeneously dense.',
      normalReport: `TECHNIQUE:
Diagnostic mammography was performed with craniocaudal and mediolateral oblique views. Additional spot compression and magnification views as indicated.

FINDINGS:
Right Breast: No masses, architectural distortion, or suspicious calcifications. Breast tissue is heterogeneously dense.

Left Breast: No masses, architectural distortion, or suspicious calcifications. Breast tissue is heterogeneously dense.

Skin: Skin is normal in thickness. No skin thickening or retraction.

Nipples: Nipples are symmetrically positioned. No inversion or discharge.

Axillae: No axillary lymphadenopathy.

IMPRESSION:
1. BI-RADS 1: Negative.
2. No mammographic evidence of malignancy.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Right Breast - Upper Outer', checked: false },
        { id: 'c2', name: 'Right Breast - Upper Inner', checked: false },
        { id: 'c3', name: 'Right Breast - Lower Outer', checked: false },
        { id: 'c4', name: 'Right Breast - Lower Inner', checked: false },
        { id: 'c5', name: 'Left Breast - Upper Outer', checked: false },
        { id: 'c6', name: 'Left Breast - Upper Inner', checked: false },
        { id: 'c7', name: 'Left Breast - Lower Outer', checked: false },
        { id: 'c8', name: 'Left Breast - Lower Inner', checked: false }
      ],
      tags: ['MAMMOGRAPHY', 'BREAST', 'DIAGNOSTIC', 'BI-RADS 1'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ CTA TEMPLATES ============
    {
      id: 'tpl_cta_head_001',
      modality: 'CTA',
      system: 'NEURO',
      name: 'CTA Head and Neck',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
CT angiography of the head and neck was performed following intravenous contrast administration.

FINDINGS:
___Intracranial Vessels: ___
___Circle of Willis: ___
___Carotid Arteries: ___
___Vertebral Arteries: ___
___Venous Sinuses: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal CTA head and neck. No aneurysms, stenosis, or occlusions. Normal vascular anatomy.',
      normalReport: `TECHNIQUE:
CT angiography of the head and neck was performed following intravenous contrast administration.

FINDINGS:
Intracranial Vessels: All intracranial arteries demonstrate normal caliber and opacification. No aneurysms, stenosis, or occlusions.

Circle of Willis: Circle of Willis is complete. No aneurysms or anomalies.

Carotid Arteries: Internal and external carotid arteries are patent bilaterally. No stenosis, dissection, or aneurysms.

Vertebral Arteries: Vertebral arteries are patent bilaterally. No stenosis or hypoplasia.

Venous Sinuses: Cerebral venous sinuses are patent. No dural venous sinus thrombosis.

IMPRESSION:
1. Normal CTA head and neck.
2. No vascular abnormalities identified.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Internal Carotid Artery - Right', checked: false },
        { id: 'c2', name: 'Internal Carotid Artery - Left', checked: false },
        { id: 'c3', name: 'Vertebral Artery - Right', checked: false },
        { id: 'c4', name: 'Vertebral Artery - Left', checked: false },
        { id: 'c5', name: 'Basilar Artery', checked: false },
        { id: 'c6', name: 'Circle of Willis', checked: false }
      ],
      tags: ['CTA', 'HEAD', 'NECK', 'ANGIOGRAPHY', 'NEURO', 'VASCULAR'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tpl_cta_chest_001',
      modality: 'CTA',
      system: 'CARDIOVASCULAR',
      name: 'CTA Chest - PE Protocol',
      bodyRegion: 'CHEST',
      templateText: `TECHNIQUE:
CT angiography of the chest was performed for pulmonary embolism evaluation.

FINDINGS:
___Pulmonary Arteries: ___
___Lungs: ___
___Heart: ___
___Mediastinum: ___
___Other: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'No pulmonary emboli. All pulmonary arteries are patent. No filling defects.',
      normalReport: `TECHNIQUE:
CT angiography of the chest was performed for pulmonary embolism evaluation.

FINDINGS:
Pulmonary Arteries: Main pulmonary artery and bilateral pulmonary arteries are patent. No filling defects to suggest pulmonary embolism. Segmental and subsegmental branches are patent bilaterally.

Lungs: Lungs are clear. No consolidations or effusions.

Heart: Right ventricle is not enlarged. No evidence of right heart strain.

Mediastinum: Mediastinum is unremarkable. No lymphadenopathy.

Other: No pneumothorax.

IMPRESSION:
1. No evidence of pulmonary embolism.
2. Pulmonary arteries are patent.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Main Pulmonary Artery', checked: false },
        { id: 'c2', name: 'Right Pulmonary Artery', checked: false },
        { id: 'c3', name: 'Left Pulmonary Artery', checked: false },
        { id: 'c4', name: 'Right Ventricle', checked: false },
        { id: 'c5', name: 'Left Ventricle', checked: false }
      ],
      tags: ['CTA', 'CHEST', 'PE', 'PULMONARY EMBOLISM', 'CARDIOVASCULAR'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    // ============ MRA TEMPLATES ============
    {
      id: 'tpl_mra_head_001',
      modality: 'MRA',
      system: 'NEURO',
      name: 'MRA Head - Intracranial',
      bodyRegion: 'HEAD',
      templateText: `TECHNIQUE:
MR angiography of the intracranial vessels was performed without intravenous contrast.

FINDINGS:
___Circle of Willis: ___
___Anterior Circulation: ___
___Posterior Circulation: ___
___Venous Sinuses: ___

IMPRESSION:
1. ___
2. ___
3. ___`,
      normalDefaults: 'Normal MRA head. No aneurysms, stenosis, or vascular malformations.',
      normalReport: `TECHNIQUE:
MR angiography of the intracranial vessels was performed without intravenous contrast.

FINDINGS:
Circle of Willis: Circle of Willis is intact and complete. No aneurysms or anomalies.

Anterior Circulation: Internal carotid arteries, anterior cerebral arteries, and middle cerebral arteries are normal in caliber and flow. No stenosis or occlusion.

Posterior Circulation: Vertebral arteries, basilar artery, posterior cerebral arteries, and posterior communicating arteries are patent. No stenosis or aneurysms.

Venous Sinuses: Cerebral venous sinuses are patent. No dural venous sinus thrombosis.

IMPRESSION:
1. Normal MRA intracranial vessels.
2. No aneurysms or vascular malformations.`,
      anatomyChecklist: [
        { id: 'c1', name: 'Internal Carotid Artery', checked: false },
        { id: 'c2', name: 'Anterior Cerebral Artery', checked: false },
        { id: 'c3', name: 'Middle Cerebral Artery', checked: false },
        { id: 'c4', name: 'Vertebral Artery', checked: false },
        { id: 'c5', name: 'Basilar Artery', checked: false },
        { id: 'c6', name: 'Posterior Cerebral Artery', checked: false }
      ],
      tags: ['MRA', 'HEAD', 'INTRACRANIAL', 'NEURO', 'VASCULAR'],
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}

// Generate more templates dynamically
function generateAdditionalTemplates() {
  const templates = getTemplateData();
  
  const bodyRegions = [
    'HEAD', 'BRAIN', 'ORBIT', 'TEMPORAL BONE', 'NECK', 'NECK SOFT TISSUE', 'THYROID',
    'CHEST', 'LUNG', 'MEDIASTINUM', 'HEART', 'BREAST',
    'ABDOMEN', 'LIVER', 'GALLBLADDER', 'PANCREAS', 'SPLEEN', 'KIDNEY', 'ADRENAL',
    'PELVIS', 'BLADDER', 'PROSTATE', 'UTERUS', 'OVARY',
    'SPINE', 'CERVICAL SPINE', 'THORACIC SPINE', 'LUMBAR SPINE',
    'UPPER EXTREMITY', 'SHOULDER', 'ELBOW', 'WRIST', 'HAND',
    'LOWER EXTREMITY', 'HIP', 'KNEE', 'ANKLE', 'FOOT',
    'JOINT', 'BONE', 'VASCULAR', 'CAROTID', 'VERTEBRAL'
  ];
  const modalities = [
    'CT', 'MRI', 'X-RAY', 'ULTRASOUND', 'MAMMOGRAPHY', 'CTA', 'MRA', 'PET-CT', 
    'ANGIOGRAPHY', 'FLUOROSCOPY', 'NUCLEAR MEDICINE', 'DEXA'
  ];
  const systems = ['NEURO', 'MSK', 'PULMONARY', 'CARDIOVASCULAR', 'GI', 'GU', 'BREAST', 'ENT', 'VASCULAR', 'ENDOCRINE'];
  
  let id = 20;
  
  // Generate templates for each combination
  for (const modality of modalities) {
    for (const bodyRegion of bodyRegions) {
      if (id > 600) break;
      
      const template = {
        id: `tpl_${modality.toLowerCase()}_${bodyRegion.toLowerCase().replace(' ', '_')}_${String(id).padStart(3, '0')}`,
        modality,
        system: systems[Math.floor(Math.random() * systems.length)],
        name: `${modality} ${bodyRegion} Template ${id}`,
        bodyRegion,
        templateText: `TECHNIQUE:\n${modality} of the ${bodyRegion} was performed.\n\nFINDINGS:\n___\n\nIMPRESSION:\n1. ___`,
        normalDefaults: `Normal ${modality} ${bodyRegion} examination. No abnormalities identified.`,
        normalReport: `TECHNIQUE:\n${modality} of the ${bodyRegion} was performed.\n\nFINDINGS:\nNo abnormalities identified.\n\nIMPRESSION:\n1. Normal ${modality} ${bodyRegion} examination.`,
        anatomyChecklist: [
          { id: `c${id}_1`, name: 'Structure 1', checked: false },
          { id: `c${id}_2`, name: 'Structure 2', checked: false },
          { id: `c${id}_3`, name: 'Structure 3', checked: false }
        ],
        tags: [modality, bodyRegion, 'ROUTINE'],
        isDefault: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      templates.push(template);
      id++;
    }
  }
  
  return templates;
}

export const templateData = generateAdditionalTemplates();

export default {
  getTemplateData,
  templateData
};