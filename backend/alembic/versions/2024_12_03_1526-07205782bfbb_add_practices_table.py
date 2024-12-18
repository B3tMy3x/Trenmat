"""add practices table

Revision ID: 07205782bfbb
Revises: 60827782816a
Create Date: 2024-12-03 15:26:09.780907

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '07205782bfbb'
down_revision: Union[str, None] = '60827782816a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('practices',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('student_id', sa.BigInteger(), nullable=False),
    sa.Column('time', sa.Date(), nullable=True),
    sa.Column('correct', sa.BigInteger(), nullable=False),
    sa.Column('count', sa.BigInteger(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('practices')
    # ### end Alembic commands ###
